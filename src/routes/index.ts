import { Hono, type Context } from "hono";
import { authMiddleware } from "../middleware/auth";
import { csrfMiddleware } from "../middleware/csrf";
import { ensureCsrfCookie } from "../lib/csrf";
import { render } from "../lib/render";
import { createWorkout, replaceWorkout, type WorkoutInput } from "../lib/workouts";
import { DAYS } from "./routines";
import type { Env, User } from "../types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OverrideItem {
  id: string;
  superset_id: string | null;
  position: number;
  lift_name: string;
  reps_min: number;
  reps_max: number;
  sets: number;
}

interface OverrideGroup {
  type: "standalone" | "superset";
  superset_id?: string;
  items: OverrideItem[];
}

interface LiftStatRow {
  user_id: string;
  lift_name: string;
  recent_date: string | null;
  recent_sets_json: string | null;
  best_volume: number | null;
  best_date: string | null;
  best_sets_json: string | null;
}

interface ParsedStat {
  recentDate: string | null;
  recentSets: { reps: number; weight: number }[];
  bestDate: string | null;
  bestSets: { reps: number; weight: number }[];
  bestVolume: number | null;
}

interface HomeItem extends OverrideItem {
  flatIdx: number;
  stat: ParsedStat | null;
}

interface HomeGroup {
  type: "standalone" | "superset";
  superset_id?: string;
  items: HomeItem[];
}

interface DailyOverride {
  id: string;
  user_id: string;
  date: string;
  routine_id: string | null;
  items_json: string;
  completed: number;
  created_at: number;
  updated_at: number;
}

interface Routine {
  id: string;
  weekday: number;
  name: string;
}

interface RoutineItem {
  id: string;
  routine_id: string;
  superset_id: string | null;
  position: number;
  lift_name: string;
  reps_min: number;
  reps_max: number;
  sets: number;
}

interface UserSettings {
  inline_logging: number;
  webhook_url: string | null;
}


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTodayInfo(): { today: string; weekday: number } {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  return { today, weekday: now.getDay() };
}

/** "2026-03-01" → "Mar 1" */
function fmtDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[m - 1]} ${d}`;
}

function parseLiftStat(row: LiftStatRow): ParsedStat {
  return {
    recentDate: row.recent_date ? fmtDate(row.recent_date) : null,
    recentSets: row.recent_sets_json ? JSON.parse(row.recent_sets_json) : [],
    bestDate: row.best_date ? fmtDate(row.best_date) : null,
    bestSets: row.best_sets_json ? JSON.parse(row.best_sets_json) : [],
    bestVolume: row.best_volume,
  };
}

/** Groups a flat, position-sorted OverrideItem list into display groups. */
function buildItemGroups(items: OverrideItem[]): OverrideGroup[] {
  const groups: OverrideGroup[] = [];
  const ssMap = new Map<string, OverrideItem[]>();
  for (const item of items) {
    if (!item.superset_id) {
      groups.push({ type: "standalone", items: [item] });
    } else {
      if (!ssMap.has(item.superset_id)) {
        const arr: OverrideItem[] = [];
        ssMap.set(item.superset_id, arr);
        groups.push({ type: "superset", superset_id: item.superset_id, items: arr });
      }
      ssMap.get(item.superset_id)!.push(item);
    }
  }
  return groups;
}

/** Enriches override items with flatIdx and lift_stats, returning HomeGroups. */
function buildHomeGroups(
  items: OverrideItem[],
  statsMap: Map<string, LiftStatRow>
): HomeGroup[] {
  let flatIdx = 0;
  const groups: HomeGroup[] = [];
  const ssMap = new Map<string, HomeItem[]>();
  for (const item of items) {
    const homeItem: HomeItem = {
      ...item,
      flatIdx: flatIdx++,
      stat: statsMap.has(item.lift_name) ? parseLiftStat(statsMap.get(item.lift_name)!) : null,
    };
    if (!item.superset_id) {
      groups.push({ type: "standalone", items: [homeItem] });
    } else {
      if (!ssMap.has(item.superset_id)) {
        const arr: HomeItem[] = [];
        ssMap.set(item.superset_id, arr);
        groups.push({ type: "superset", superset_id: item.superset_id, items: arr });
      }
      ssMap.get(item.superset_id)!.push(homeItem);
    }
  }
  return groups;
}

/** Flattens groups back to a flat OverrideItem list with sequential positions. */
function flattenGroups(groups: OverrideGroup[]): OverrideItem[] {
  let pos = 0;
  return groups.flatMap((g) => g.items.map((item) => ({ ...item, position: pos++ })));
}

/**
 * Gets today's daily_override, or snapshots the current routine items into a
 * new override row (lazy creation on first mutation).
 */
async function getOrSnapshotOverride(
  db: D1Database,
  userId: string,
  today: string,
  weekday: number
): Promise<{ id: string; items: OverrideItem[] }> {
  const existing = await db
    .prepare("SELECT id, items_json FROM daily_overrides WHERE user_id = ? AND date = ?")
    .bind(userId, today)
    .first<{ id: string; items_json: string }>();

  if (existing) {
    return { id: existing.id, items: JSON.parse(existing.items_json) };
  }

  // Snapshot routine items
  const routine = await db
    .prepare("SELECT id FROM routines WHERE user_id = ? AND weekday = ?")
    .bind(userId, weekday)
    .first<{ id: string }>();

  let items: OverrideItem[] = [];
  if (routine) {
    const rows = await db
      .prepare("SELECT * FROM routine_items WHERE routine_id = ? ORDER BY position")
      .bind(routine.id)
      .all<RoutineItem>();
    items = rows.results.map((ri) => ({
      id: crypto.randomUUID(),
      superset_id: ri.superset_id,
      position: ri.position,
      lift_name: ri.lift_name,
      reps_min: ri.reps_min,
      reps_max: ri.reps_max,
      sets: ri.sets,
    }));
  }

  const overrideId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  await db
    .prepare(
      "INSERT INTO daily_overrides (id, user_id, date, routine_id, items_json, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, ?, ?)"
    )
    .bind(overrideId, userId, today, routine?.id ?? null, JSON.stringify(items), now, now)
    .run();

  return { id: overrideId, items };
}

async function updateOverrideItems(
  db: D1Database,
  overrideId: string,
  items: OverrideItem[]
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  await db
    .prepare("UPDATE daily_overrides SET items_json = ?, updated_at = ? WHERE id = ?")
    .bind(JSON.stringify(items), now, overrideId)
    .run();
}

/** Loads all data needed to render the home page. */
async function loadHomeData(
  db: D1Database,
  userId: string,
  today: string,
  weekday: number
) {
  const [overrideRow, routine, settings] = await Promise.all([
    db
      .prepare("SELECT * FROM daily_overrides WHERE user_id = ? AND date = ?")
      .bind(userId, today)
      .first<DailyOverride>(),
    db
      .prepare("SELECT id, weekday, name FROM routines WHERE user_id = ? AND weekday = ?")
      .bind(userId, weekday)
      .first<Routine>(),
    db
      .prepare("SELECT inline_logging, webhook_url FROM user_settings WHERE user_id = ?")
      .bind(userId)
      .first<UserSettings>(),
  ]);

  let items: OverrideItem[];
  let completed = false;

  if (overrideRow) {
    items = JSON.parse(overrideRow.items_json);
    completed = overrideRow.completed === 1;
  } else if (routine) {
    const rows = await db
      .prepare("SELECT * FROM routine_items WHERE routine_id = ? ORDER BY position")
      .bind(routine.id)
      .all<RoutineItem>();
    items = rows.results.map((ri) => ({
      id: ri.id,
      superset_id: ri.superset_id,
      position: ri.position,
      lift_name: ri.lift_name,
      reps_min: ri.reps_min,
      reps_max: ri.reps_max,
      sets: ri.sets,
    }));
  } else {
    items = [];
  }

  // Load all lift_stats for user in one query, then index by lift_name
  const statsRows = await db
    .prepare("SELECT * FROM lift_stats WHERE user_id = ?")
    .bind(userId)
    .all<LiftStatRow>();
  const statsMap = new Map(statsRows.results.map((r) => [r.lift_name, r]));

  return {
    items,
    routine: routine ?? null,
    completed,
    inlineLogging: (settings?.inline_logging ?? 0) === 1,
    webhookUrl: settings?.webhook_url ?? null,
    statsMap,
  };
}

type HomeContext = Context<{ Bindings: Env; Variables: { userId: string; user: User } }>;

/** Renders the lifts-panel partial after loading fresh home data. */
async function renderLiftsPanel(
  c: HomeContext,
  userId: string,
  today: string,
  weekday: number
): Promise<Response> {
  const data = await loadHomeData(c.env.DB, userId, today, weekday);
  const groups = buildHomeGroups(data.items, data.statsMap);
  const csrfToken = ensureCsrfCookie(c);
  return c.html(
    render("partials/home/lifts-panel.njk", {
      groups,
      inlineLogging: data.inlineLogging,
      completed: data.completed,
      today,
      weekday,
      csrfToken,
    })
  );
}

/** Parses inline-logging form data into a WorkoutInput (or null if no valid sets). */
function parseCompletionForm(
  body: Record<string, string | string[]>
): WorkoutInput | null {
  const toArr = (v: string | string[] | undefined): string[] =>
    !v ? [] : Array.isArray(v) ? v : [v];

  const liftNames = toArr(body["lift_name[]"]);
  const liftSupersets = toArr(body["lift_superset[]"]);
  const setLiftIdxs = toArr(body["set_lift[]"]);
  const setReps = toArr(body["set_reps[]"]);
  const setWeights = toArr(body["set_weight[]"]);

  if (liftNames.length === 0) return null;

  const lifts = liftNames.map((name, idx) => ({
    lift_name: name.trim(),
    superset_id: liftSupersets[idx]?.trim() || null,
    position: idx,
    sets: [] as { set_number: number; reps: number; weight: number }[],
  }));

  const setCountPerLift = new Array(lifts.length).fill(0);
  for (let i = 0; i < setLiftIdxs.length; i++) {
    const liftIdx = parseInt(setLiftIdxs[i]);
    if (isNaN(liftIdx) || liftIdx < 0 || liftIdx >= lifts.length) continue;
    const reps = parseInt(setReps[i] ?? "");
    const weight = parseFloat(setWeights[i] ?? "");
    if (isNaN(reps) || isNaN(weight) || (reps === 0 && weight === 0)) continue;
    setCountPerLift[liftIdx]++;
    lifts[liftIdx].sets.push({ set_number: setCountPerLift[liftIdx], reps, weight });
  }

  const validLifts = lifts.filter((l) => l.sets.length > 0 && l.lift_name);
  if (validLifts.length === 0) return null;

  return {
    date: (body["date"] as string) || today_fallback(),
    lifts: validLifts,
  };
}

function today_fallback(): string {
  return new Date().toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const index = new Hono<{ Bindings: Env; Variables: { userId: string; user: User } }>();

// ---------------------------------------------------------------------------
// GET /health — public, no auth
// ---------------------------------------------------------------------------
index.get("/health", (c) => c.json({ ok: true }));

index.use("*", authMiddleware);

// ---------------------------------------------------------------------------
// GET / — home page
// ---------------------------------------------------------------------------
index.get("/", async (c) => {
  const { today, weekday } = getTodayInfo();
  const userId = c.get("userId");

  const data = await loadHomeData(c.env.DB, userId, today, weekday);
  const groups = buildHomeGroups(data.items, data.statsMap);
  const csrfToken = ensureCsrfCookie(c);

  // Fire-and-forget: expire overrides from previous occurrences of this weekday
  c.executionCtx.waitUntil(
    c.env.DB.prepare(
      "DELETE FROM daily_overrides WHERE user_id = ? AND date < ? AND CAST(strftime('%w', date) AS INTEGER) = ?"
    )
      .bind(userId, today, weekday)
      .run()
      .catch(() => {})
  );

  return c.html(
    render("pages/index.njk", {
      title: "Workout",
      pageTitle: `${DAYS[weekday]} · ${fmtDate(today)}`,
      user: c.get("user"),
      csrfToken,
      weekday,
      dayName: DAYS[weekday],
      today,
      routine: data.routine,
      groups,
      inlineLogging: data.inlineLogging,
      completed: data.completed,
    })
  );
});

// ---------------------------------------------------------------------------
// POST /override/items — add a lift to today's override
// ---------------------------------------------------------------------------
index.post("/override/items", csrfMiddleware, async (c) => {
  const { today, weekday } = getTodayInfo();
  const userId = c.get("userId");
  const body = await c.req.parseBody();

  const liftName = ((body.lift_name as string) ?? "").trim();
  const repsMin = parseInt(body.reps_min as string);
  const repsMax = parseInt(body.reps_max as string);
  const sets = parseInt(body.sets as string);

  if (!liftName || isNaN(repsMin) || isNaN(repsMax) || isNaN(sets)) {
    return renderLiftsPanel(c, userId, today, weekday);
  }

  const { id: overrideId, items } = await getOrSnapshotOverride(
    c.env.DB, userId, today, weekday
  );

  const maxPos = items.reduce((m, i) => Math.max(m, i.position), -1);
  items.push({
    id: crypto.randomUUID(),
    superset_id: null,
    position: maxPos + 1,
    lift_name: liftName,
    reps_min: repsMin,
    reps_max: repsMax,
    sets,
  });

  await updateOverrideItems(c.env.DB, overrideId, items);
  return renderLiftsPanel(c, userId, today, weekday);
});

// ---------------------------------------------------------------------------
// POST /override/items/:id/delete — remove a lift from today's override
// ---------------------------------------------------------------------------
index.post("/override/items/:id/delete", csrfMiddleware, async (c) => {
  const { today, weekday } = getTodayInfo();
  const userId = c.get("userId");
  const itemId = c.req.param("id");

  const { id: overrideId, items } = await getOrSnapshotOverride(
    c.env.DB, userId, today, weekday
  );

  const filtered = items.filter((i) => i.id !== itemId);
  await updateOverrideItems(c.env.DB, overrideId, filtered);
  return renderLiftsPanel(c, userId, today, weekday);
});

// ---------------------------------------------------------------------------
// POST /override/items/:id/move — reorder a lift or superset group
// ---------------------------------------------------------------------------
index.post("/override/items/:id/move", csrfMiddleware, async (c) => {
  const { today, weekday } = getTodayInfo();
  const userId = c.get("userId");
  const itemId = c.req.param("id");
  const body = await c.req.parseBody();
  const direction = body.direction as string;
  if (direction !== "up" && direction !== "down") {
    return renderLiftsPanel(c, userId, today, weekday);
  }

  const { id: overrideId, items } = await getOrSnapshotOverride(
    c.env.DB, userId, today, weekday
  );
  const groups = buildItemGroups(items);
  const groupIdx = groups.findIndex((g) => g.items.some((it) => it.id === itemId));

  if (groupIdx !== -1) {
    const targetIdx = direction === "up" ? groupIdx - 1 : groupIdx + 1;
    if (targetIdx >= 0 && targetIdx < groups.length) {
      [groups[groupIdx], groups[targetIdx]] = [groups[targetIdx], groups[groupIdx]];
    }
    await updateOverrideItems(c.env.DB, overrideId, flattenGroups(groups));
  }

  return renderLiftsPanel(c, userId, today, weekday);
});

// ---------------------------------------------------------------------------
// POST /override/superset — group checked items into a superset
// ---------------------------------------------------------------------------
index.post("/override/superset", csrfMiddleware, async (c) => {
  const { today, weekday } = getTodayInfo();
  const userId = c.get("userId");
  const body = await c.req.parseBody({ all: true });

  const { id: overrideId, items } = await getOrSnapshotOverride(
    c.env.DB, userId, today, weekday
  );

  const raw = body["item_ids[]"] ?? body["item_ids"];
  const ids: string[] = Array.isArray(raw) ? (raw as string[]) : raw ? [raw as string] : [];

  if (ids.length >= 2) {
    const validIds = new Set(items.map((i) => i.id));
    if (ids.every((id) => validIds.has(id))) {
      const supersetId = crypto.randomUUID();
      const updated = items.map((item) =>
        ids.includes(item.id) ? { ...item, superset_id: supersetId } : item
      );
      await updateOverrideItems(c.env.DB, overrideId, updated);
    }
  }

  return renderLiftsPanel(c, userId, today, weekday);
});

// ---------------------------------------------------------------------------
// POST /override/items/:id/unsuperset — remove a lift from its superset
// ---------------------------------------------------------------------------
index.post("/override/items/:id/unsuperset", csrfMiddleware, async (c) => {
  const { today, weekday } = getTodayInfo();
  const userId = c.get("userId");
  const itemId = c.req.param("id");

  const { id: overrideId, items } = await getOrSnapshotOverride(
    c.env.DB, userId, today, weekday
  );
  const updated = items.map((item) =>
    item.id === itemId ? { ...item, superset_id: null } : item
  );
  await updateOverrideItems(c.env.DB, overrideId, updated);
  return renderLiftsPanel(c, userId, today, weekday);
});

// ---------------------------------------------------------------------------
// POST /complete — mark today's workout done, optionally log sets
// ---------------------------------------------------------------------------
index.post("/complete", csrfMiddleware, async (c) => {
  const { today, weekday } = getTodayInfo();
  const userId = c.get("userId");
  const body = await c.req.parseBody({ all: true });
  const now = Math.floor(Date.now() / 1000);

  // Check user settings for inline_logging and webhook_url
  const settings = await c.env.DB
    .prepare("SELECT inline_logging, webhook_url FROM user_settings WHERE user_id = ?")
    .bind(userId)
    .first<UserSettings>();

  let workoutId: string | null = null;

  // If inline logging is on, parse and save set data
  if ((settings?.inline_logging ?? 0) === 1) {
    const parsed = parseCompletionForm(body as Record<string, string | string[]>);
    if (parsed) {
      // Upsert: replace today's workout if it already exists
      const existing = await c.env.DB
        .prepare("SELECT id FROM workouts WHERE user_id = ? AND date = ?")
        .bind(userId, today)
        .first<{ id: string }>();

      if (existing) {
        await replaceWorkout(c.env.DB, userId, existing.id, parsed);
        workoutId = existing.id;
      } else {
        workoutId = await createWorkout(c.env.DB, userId, parsed);
      }
    }
  }

  // Mark (or create) the override as completed
  const overrideRow = await c.env.DB
    .prepare("SELECT id FROM daily_overrides WHERE user_id = ? AND date = ?")
    .bind(userId, today)
    .first<{ id: string }>();

  if (overrideRow) {
    await c.env.DB
      .prepare("UPDATE daily_overrides SET completed = 1, updated_at = ? WHERE id = ?")
      .bind(now, overrideRow.id)
      .run();
  } else {
    const routine = await c.env.DB
      .prepare("SELECT id FROM routines WHERE user_id = ? AND weekday = ?")
      .bind(userId, weekday)
      .first<{ id: string }>();
    await c.env.DB
      .prepare(
        "INSERT INTO daily_overrides (id, user_id, date, routine_id, items_json, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?)"
      )
      .bind(crypto.randomUUID(), userId, today, routine?.id ?? null, "[]", now, now)
      .run();
  }

  // Fire webhook (best-effort, non-blocking)
  const webhookUrl = settings?.webhook_url;
  if (webhookUrl) {
    const payload = JSON.stringify({ date: today, completed: true, workout_id: workoutId });
    c.executionCtx.waitUntil(
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }).catch(() => {})
    );
  }

  return c.redirect("/", 302);
});

export default index;
