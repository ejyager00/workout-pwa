import { Hono, type Context } from "hono";
import { zValidator } from "@hono/zod-validator";
import { RoutineItemSchema, RoutineNameSchema } from "../schemas/routines";
import { authMiddleware } from "../middleware/auth";
import { csrfMiddleware } from "../middleware/csrf";
import { ensureCsrfCookie } from "../lib/csrf";
import { render } from "../lib/render";
import type { Env, User } from "../types";

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Routine {
  id: string;
  user_id: string;
  name: string;
  created_at: number;
  updated_at: number;
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
  created_at: number;
}

interface DisplayGroup {
  type: "standalone" | "superset";
  superset_id?: string;
  items: RoutineItem[];
}

type RoutinesCtx = Context<{
  Bindings: Env;
  Variables: { userId: string; user: User };
}>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Groups a position-sorted list of items into display groups. */
function buildGroups(items: RoutineItem[]): DisplayGroup[] {
  const groups: DisplayGroup[] = [];
  const supersetMap = new Map<string, RoutineItem[]>();

  for (const item of items) {
    if (!item.superset_id) {
      groups.push({ type: "standalone", items: [item] });
    } else {
      if (!supersetMap.has(item.superset_id)) {
        const arr: RoutineItem[] = [];
        supersetMap.set(item.superset_id, arr);
        groups.push({ type: "superset", superset_id: item.superset_id, items: arr });
      }
      supersetMap.get(item.superset_id)!.push(item);
    }
  }

  return groups;
}

/** Produces sequential position assignments from an ordered groups array. */
function positionUpdates(groups: DisplayGroup[]): { id: string; position: number }[] {
  const updates: { id: string; position: number }[] = [];
  let pos = 0;
  for (const group of groups) {
    for (const item of group.items) {
      updates.push({ id: item.id, position: pos++ });
    }
  }
  return updates;
}

/** Loads a routine, scoped to its owner. Returns null if missing or not theirs. */
async function getRoutine(
  db: D1Database,
  userId: string,
  routineId: string
): Promise<Routine | null> {
  return db
    .prepare("SELECT * FROM routines WHERE id = ? AND user_id = ?")
    .bind(routineId, userId)
    .first<Routine>();
}

/** Loads all items for a routine, ordered by position. */
async function getItems(db: D1Database, routineId: string): Promise<RoutineItem[]> {
  const result = await db
    .prepare("SELECT * FROM routine_items WHERE routine_id = ? ORDER BY position")
    .bind(routineId)
    .all<RoutineItem>();
  return result.results;
}

/** Weekdays a routine is scheduled on, as display abbreviations. */
async function getScheduledDays(
  db: D1Database,
  userId: string,
  routineId: string
): Promise<string[]> {
  const rows = await db
    .prepare(
      "SELECT weekday FROM routine_schedule WHERE user_id = ? AND routine_id = ? ORDER BY weekday"
    )
    .bind(userId, routineId)
    .all<{ weekday: number }>();
  return rows.results.map((r) => DAY_ABBR[r.weekday]);
}

/** Returns the items-list partial as an htmx fragment. */
function renderItemsPartial(c: RoutinesCtx, routine: Routine, items: RoutineItem[]) {
  const csrfToken = ensureCsrfCookie(c);
  return c.html(
    render("partials/routines/items-list.njk", {
      routine,
      groups: buildGroups(items),
      csrfToken,
    })
  );
}

/**
 * Loads the weekly schedule and the full routine library in the shape the
 * manager partial expects. Both are rendered together because assigning a
 * weekday also changes the day chips shown against each routine.
 */
async function loadManagerData(db: D1Database, userId: string) {
  const [summaryRows, scheduleRows] = await Promise.all([
    db
      .prepare(
        `SELECT r.id, r.name, COUNT(ri.id) AS lift_count
           FROM routines r
           LEFT JOIN routine_items ri ON ri.routine_id = r.id
          WHERE r.user_id = ?
          GROUP BY r.id, r.name
          ORDER BY r.name COLLATE NOCASE`
      )
      .bind(userId)
      .all<{ id: string; name: string; lift_count: number }>(),
    db
      .prepare("SELECT weekday, routine_id FROM routine_schedule WHERE user_id = ?")
      .bind(userId)
      .all<{ weekday: number; routine_id: string }>(),
  ]);

  const routineById = new Map(summaryRows.results.map((r) => [r.id, r]));
  const scheduledDays = new Map<string, number[]>();
  for (const row of scheduleRows.results) {
    const days = scheduledDays.get(row.routine_id) ?? [];
    days.push(row.weekday);
    scheduledDays.set(row.routine_id, days);
  }

  const scheduleByDay = new Map(
    scheduleRows.results.map((s) => [s.weekday, routineById.get(s.routine_id) ?? null])
  );

  return {
    days: DAYS.map((name, weekday) => ({
      weekday,
      name,
      routine: scheduleByDay.get(weekday) ?? null,
    })),
    routines: summaryRows.results.map((r) => ({
      ...r,
      dayNames: (scheduledDays.get(r.id) ?? []).sort((a, b) => a - b).map((d) => DAY_ABBR[d]),
    })),
  };
}

/** Returns the schedule + library manager partial as an htmx fragment. */
async function renderManagerPartial(c: RoutinesCtx, userId: string) {
  const data = await loadManagerData(c.env.DB, userId);
  const csrfToken = ensureCsrfCookie(c);
  return c.html(render("partials/routines/manager.njk", { ...data, csrfToken }));
}

/** Parses and validates the weekday param; returns null on invalid input. */
function parseDay(param: string): number | null {
  const n = parseInt(param, 10);
  return isNaN(n) || n < 0 || n > 6 ? null : n;
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const routines = new Hono<{
  Bindings: Env;
  Variables: { userId: string; user: User };
}>();

routines.use("*", authMiddleware);

// ---------------------------------------------------------------------------
// GET /routines — weekly schedule + routine library
// ---------------------------------------------------------------------------
routines.get("/", async (c) => {
  const userId = c.get("userId");
  const data = await loadManagerData(c.env.DB, userId);
  const csrfToken = ensureCsrfCookie(c as RoutinesCtx);

  return c.html(
    render("pages/routines/list.njk", {
      title: "My Routines",
      ...data,
      csrfToken,
      user: c.get("user"),
    })
  );
});

// ---------------------------------------------------------------------------
// POST /routines — create a routine
// ---------------------------------------------------------------------------
routines.post(
  "/",
  csrfMiddleware,
  zValidator("form", RoutineNameSchema, (result, c) => {
    if (!result.success) return c.redirect("/routines", 302);
  }),
  async (c) => {
    const userId = c.get("userId");
    const { name } = c.req.valid("form");
    const id = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);

    await c.env.DB.prepare(
      "INSERT INTO routines (id, user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(id, userId, name, now, now)
      .run();

    // Land in the editor so the new routine can be filled in immediately.
    return c.redirect(`/routines/${id}`, 302);
  }
);

// ---------------------------------------------------------------------------
// POST /routines/schedule/:weekday — assign a routine to a weekday
// An empty routine_id clears the day, making it a rest day.
// ---------------------------------------------------------------------------
routines.post("/schedule/:weekday", csrfMiddleware, async (c) => {
  const weekday = parseDay(c.req.param("weekday"));
  if (weekday === null) return c.notFound();

  const userId = c.get("userId");
  const body = await c.req.parseBody();
  const routineId = ((body.routine_id as string) ?? "").trim();
  const now = Math.floor(Date.now() / 1000);

  if (!routineId) {
    await c.env.DB.prepare(
      "DELETE FROM routine_schedule WHERE user_id = ? AND weekday = ?"
    )
      .bind(userId, weekday)
      .run();
  } else if (await getRoutine(c.env.DB, userId, routineId)) {
    await c.env.DB.prepare(
      "INSERT INTO routine_schedule (user_id, weekday, routine_id, updated_at) VALUES (?, ?, ?, ?) " +
        "ON CONFLICT(user_id, weekday) DO UPDATE SET routine_id = excluded.routine_id, updated_at = excluded.updated_at"
    )
      .bind(userId, weekday, routineId, now)
      .run();
  }

  return renderManagerPartial(c as RoutinesCtx, userId);
});

// ---------------------------------------------------------------------------
// GET /routines/:id — routine editor
// ---------------------------------------------------------------------------
routines.get("/:id", async (c) => {
  const userId = c.get("userId");
  const routine = await getRoutine(c.env.DB, userId, c.req.param("id"));
  if (!routine) return c.notFound();

  const [items, dayNames] = await Promise.all([
    getItems(c.env.DB, routine.id),
    getScheduledDays(c.env.DB, userId, routine.id),
  ]);

  const csrfToken = ensureCsrfCookie(c as RoutinesCtx);
  return c.html(
    render("pages/routines/detail.njk", {
      title: routine.name,
      routine,
      dayNames,
      groups: buildGroups(items),
      csrfToken,
      user: c.get("user"),
    })
  );
});

// ---------------------------------------------------------------------------
// POST /routines/:id/name — rename a routine
// ---------------------------------------------------------------------------
routines.post(
  "/:id/name",
  csrfMiddleware,
  zValidator("form", RoutineNameSchema, (result, c) => {
    if (!result.success) return c.redirect(`/routines/${c.req.param("id")}`, 302);
  }),
  async (c) => {
    const userId = c.get("userId");
    const routine = await getRoutine(c.env.DB, userId, c.req.param("id"));
    if (!routine) return c.notFound();

    const { name } = c.req.valid("form");
    const now = Math.floor(Date.now() / 1000);

    await c.env.DB.prepare(
      "UPDATE routines SET name = ?, updated_at = ? WHERE id = ? AND user_id = ?"
    )
      .bind(name, now, routine.id, userId)
      .run();

    return c.redirect(`/routines/${routine.id}`, 302);
  }
);

// ---------------------------------------------------------------------------
// POST /routines/:id/duplicate — copy a routine and all of its lifts
// ---------------------------------------------------------------------------
routines.post("/:id/duplicate", csrfMiddleware, async (c) => {
  const userId = c.get("userId");
  const routine = await getRoutine(c.env.DB, userId, c.req.param("id"));
  if (!routine) return c.notFound();

  const items = await getItems(c.env.DB, routine.id);
  const newId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const name = `${routine.name} (copy)`.slice(0, 100);

  // Superset ids are regenerated so the copy's groupings are independent.
  const supersetMap = new Map<string, string>();
  const statements = [
    c.env.DB.prepare(
      "INSERT INTO routines (id, user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(newId, userId, name, now, now),
    ...items.map((item) => {
      let supersetId: string | null = null;
      if (item.superset_id) {
        if (!supersetMap.has(item.superset_id)) {
          supersetMap.set(item.superset_id, crypto.randomUUID());
        }
        supersetId = supersetMap.get(item.superset_id)!;
      }
      return c.env.DB.prepare(
        "INSERT INTO routine_items (id, routine_id, superset_id, position, lift_name, reps_min, reps_max, sets, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        crypto.randomUUID(),
        newId,
        supersetId,
        item.position,
        item.lift_name,
        item.reps_min,
        item.reps_max,
        item.sets,
        now
      );
    }),
  ];

  await c.env.DB.batch(statements);

  return c.redirect(`/routines/${newId}`, 302);
});

// ---------------------------------------------------------------------------
// POST /routines/:id/delete — delete a routine
// Items and schedule rows cascade; daily_overrides.routine_id is set to NULL,
// so a day already built from this routine keeps its lifts.
// ---------------------------------------------------------------------------
routines.post("/:id/delete", csrfMiddleware, async (c) => {
  const userId = c.get("userId");
  const routine = await getRoutine(c.env.DB, userId, c.req.param("id"));
  if (!routine) return c.notFound();

  await c.env.DB.prepare("DELETE FROM routines WHERE id = ? AND user_id = ?")
    .bind(routine.id, userId)
    .run();

  return c.redirect("/routines", 302);
});

// ---------------------------------------------------------------------------
// POST /routines/:id/items — add a lift
// ---------------------------------------------------------------------------
routines.post(
  "/:id/items",
  csrfMiddleware,
  zValidator("form", RoutineItemSchema, (result, c) => {
    if (!result.success) return c.redirect(`/routines/${c.req.param("id")}`, 302);
  }),
  async (c) => {
    const userId = c.get("userId");
    const routine = await getRoutine(c.env.DB, userId, c.req.param("id"));
    if (!routine) return c.notFound();

    const { lift_name, reps_min, reps_max, sets } = c.req.valid("form");

    const maxRow = await c.env.DB.prepare(
      "SELECT MAX(position) as max_pos FROM routine_items WHERE routine_id = ?"
    )
      .bind(routine.id)
      .first<{ max_pos: number | null }>();

    const position = (maxRow?.max_pos ?? -1) + 1;
    const id = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);

    await c.env.DB.prepare(
      "INSERT INTO routine_items (id, routine_id, superset_id, position, lift_name, reps_min, reps_max, sets, created_at) VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?)"
    )
      .bind(id, routine.id, position, lift_name, reps_min, reps_max, sets, now)
      .run();

    const items = await getItems(c.env.DB, routine.id);
    return renderItemsPartial(c as RoutinesCtx, routine, items);
  }
);

// ---------------------------------------------------------------------------
// POST /routines/:id/items/:itemId — update a lift
// ---------------------------------------------------------------------------
routines.post(
  "/:id/items/:itemId",
  csrfMiddleware,
  zValidator("form", RoutineItemSchema, (result, c) => {
    if (!result.success) return c.redirect(`/routines/${c.req.param("id")}`, 302);
  }),
  async (c) => {
    const userId = c.get("userId");
    const routine = await getRoutine(c.env.DB, userId, c.req.param("id"));
    if (!routine) return c.notFound();

    const itemId = c.req.param("itemId");
    const { lift_name, reps_min, reps_max, sets } = c.req.valid("form");

    const existing = await c.env.DB.prepare(
      "SELECT id FROM routine_items WHERE id = ? AND routine_id = ?"
    )
      .bind(itemId, routine.id)
      .first();
    if (!existing) return c.notFound();

    await c.env.DB.prepare(
      "UPDATE routine_items SET lift_name = ?, reps_min = ?, reps_max = ?, sets = ? WHERE id = ?"
    )
      .bind(lift_name, reps_min, reps_max, sets, itemId)
      .run();

    const items = await getItems(c.env.DB, routine.id);
    return renderItemsPartial(c as RoutinesCtx, routine, items);
  }
);

// ---------------------------------------------------------------------------
// POST /routines/:id/items/:itemId/delete — remove a lift
// ---------------------------------------------------------------------------
routines.post("/:id/items/:itemId/delete", csrfMiddleware, async (c) => {
  const userId = c.get("userId");
  const routine = await getRoutine(c.env.DB, userId, c.req.param("id"));
  if (!routine) return c.notFound();

  const itemId = c.req.param("itemId");
  const existing = await c.env.DB.prepare(
    "SELECT id FROM routine_items WHERE id = ? AND routine_id = ?"
  )
    .bind(itemId, routine.id)
    .first();
  if (!existing) return c.notFound();

  await c.env.DB.prepare("DELETE FROM routine_items WHERE id = ?").bind(itemId).run();

  const items = await getItems(c.env.DB, routine.id);
  return renderItemsPartial(c as RoutinesCtx, routine, items);
});

// ---------------------------------------------------------------------------
// POST /routines/:id/items/:itemId/move — reorder a lift or superset group
// ---------------------------------------------------------------------------
routines.post("/:id/items/:itemId/move", csrfMiddleware, async (c) => {
  const userId = c.get("userId");
  const routine = await getRoutine(c.env.DB, userId, c.req.param("id"));
  if (!routine) return c.notFound();

  const itemId = c.req.param("itemId");
  const body = await c.req.parseBody();
  const direction = body.direction as string;
  if (direction !== "up" && direction !== "down") return c.notFound();

  const items = await getItems(c.env.DB, routine.id);
  const groups = buildGroups(items);

  const groupIdx = groups.findIndex((g) => g.items.some((it) => it.id === itemId));
  if (groupIdx === -1) return c.notFound();

  const targetIdx = direction === "up" ? groupIdx - 1 : groupIdx + 1;
  if (targetIdx >= 0 && targetIdx < groups.length) {
    [groups[groupIdx], groups[targetIdx]] = [groups[targetIdx], groups[groupIdx]];

    const updates = positionUpdates(groups);
    await c.env.DB.batch(
      updates.map((u) =>
        c.env.DB.prepare("UPDATE routine_items SET position = ? WHERE id = ?").bind(
          u.position,
          u.id
        )
      )
    );
  }

  const freshItems = await getItems(c.env.DB, routine.id);
  return renderItemsPartial(c as RoutinesCtx, routine, freshItems);
});

// ---------------------------------------------------------------------------
// POST /routines/:id/superset — group checked items into a superset
// ---------------------------------------------------------------------------
routines.post("/:id/superset", csrfMiddleware, async (c) => {
  const userId = c.get("userId");
  const routine = await getRoutine(c.env.DB, userId, c.req.param("id"));
  if (!routine) return c.notFound();

  const body = await c.req.parseBody({ all: true });

  const raw = body["item_ids[]"] ?? body["item_ids"];
  const ids: string[] = Array.isArray(raw)
    ? (raw as string[])
    : raw
    ? [raw as string]
    : [];

  const items = await getItems(c.env.DB, routine.id);

  if (ids.length >= 2) {
    const validIds = new Set(items.map((i) => i.id));
    if (ids.every((id) => validIds.has(id))) {
      const supersetId = crypto.randomUUID();
      await c.env.DB.batch(
        ids.map((id) =>
          c.env.DB
            .prepare("UPDATE routine_items SET superset_id = ? WHERE id = ?")
            .bind(supersetId, id)
        )
      );
      const freshItems = await getItems(c.env.DB, routine.id);
      return renderItemsPartial(c as RoutinesCtx, routine, freshItems);
    }
  }

  return renderItemsPartial(c as RoutinesCtx, routine, items);
});

// ---------------------------------------------------------------------------
// POST /routines/:id/items/:itemId/unsuperset — remove a lift from its superset
// ---------------------------------------------------------------------------
routines.post("/:id/items/:itemId/unsuperset", csrfMiddleware, async (c) => {
  const userId = c.get("userId");
  const routine = await getRoutine(c.env.DB, userId, c.req.param("id"));
  if (!routine) return c.notFound();

  const itemId = c.req.param("itemId");
  const existing = await c.env.DB.prepare(
    "SELECT id FROM routine_items WHERE id = ? AND routine_id = ?"
  )
    .bind(itemId, routine.id)
    .first();
  if (!existing) return c.notFound();

  await c.env.DB.prepare("UPDATE routine_items SET superset_id = NULL WHERE id = ?")
    .bind(itemId)
    .run();

  const items = await getItems(c.env.DB, routine.id);
  return renderItemsPartial(c as RoutinesCtx, routine, items);
});

export default routines;
