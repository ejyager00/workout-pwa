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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Routine {
  id: string;
  user_id: string;
  weekday: number;
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

/** Gets or creates a routine for the given user + weekday. */
async function getOrCreateRoutine(
  db: D1Database,
  userId: string,
  weekday: number
): Promise<Routine> {
  const existing = await db
    .prepare("SELECT * FROM routines WHERE user_id = ? AND weekday = ?")
    .bind(userId, weekday)
    .first<Routine>();

  if (existing) return existing;

  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  await db
    .prepare(
      "INSERT INTO routines (id, user_id, weekday, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(id, userId, weekday, "", now, now)
    .run();

  return { id, user_id: userId, weekday, name: "", created_at: now, updated_at: now };
}

/** Loads all items for a routine, ordered by position. */
async function getItems(db: D1Database, routineId: string): Promise<RoutineItem[]> {
  const result = await db
    .prepare("SELECT * FROM routine_items WHERE routine_id = ? ORDER BY position")
    .bind(routineId)
    .all<RoutineItem>();
  return result.results;
}

/** Returns the items-list partial as an htmx fragment. */
function renderItemsPartial(c: RoutinesCtx, routine: Routine, items: RoutineItem[]) {
  const csrfToken = ensureCsrfCookie(c);
  return c.html(
    render("partials/routines/items-list.njk", {
      routine,
      groups: buildGroups(items),
      day: routine.weekday,
      csrfToken,
    })
  );
}

/** Parses and validates the day param; returns null on invalid input. */
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
// GET /routines — weekly overview
// ---------------------------------------------------------------------------
routines.get("/", async (c) => {
  const userId = c.get("userId");
  const rows = await c.env.DB.prepare(
    "SELECT * FROM routines WHERE user_id = ? ORDER BY weekday"
  )
    .bind(userId)
    .all<Routine>();

  const routineByDay = new Map(rows.results.map((r) => [r.weekday, r]));
  const days = DAYS.map((name, idx) => ({
    weekday: idx,
    name,
    routine: routineByDay.get(idx) ?? null,
  }));

  const csrfToken = ensureCsrfCookie(c as RoutinesCtx);
  return c.html(
    render("pages/routines/list.njk", {
      title: "My Routines",
      days,
      csrfToken,
      user: c.get("user"),
    })
  );
});

// ---------------------------------------------------------------------------
// GET /routines/:day — day editor
// ---------------------------------------------------------------------------
routines.get("/:day", async (c) => {
  const dayParam = parseDay(c.req.param("day"));
  if (dayParam === null) return c.notFound();

  const userId = c.get("userId");
  const routine = await getOrCreateRoutine(c.env.DB, userId, dayParam);
  const items = await getItems(c.env.DB, routine.id);

  const csrfToken = ensureCsrfCookie(c as RoutinesCtx);
  return c.html(
    render("pages/routines/day.njk", {
      title: `${DAYS[dayParam]} Routine`,
      dayName: DAYS[dayParam],
      day: dayParam,
      routine,
      groups: buildGroups(items),
      csrfToken,
      user: c.get("user"),
    })
  );
});

// ---------------------------------------------------------------------------
// POST /routines/:day/name — update routine name
// ---------------------------------------------------------------------------
routines.post(
  "/:day/name",
  csrfMiddleware,
  zValidator("form", RoutineNameSchema),
  async (c) => {
    const dayParam = parseDay(c.req.param("day"));
    if (dayParam === null) return c.notFound();

    const userId = c.get("userId");
    const { name } = c.req.valid("form");
    const routine = await getOrCreateRoutine(c.env.DB, userId, dayParam);
    const now = Math.floor(Date.now() / 1000);

    await c.env.DB.prepare(
      "UPDATE routines SET name = ?, updated_at = ? WHERE id = ? AND user_id = ?"
    )
      .bind(name, now, routine.id, userId)
      .run();

    return c.redirect(`/routines/${dayParam}`, 302);
  }
);

// ---------------------------------------------------------------------------
// POST /routines/:day/items — add a lift
// ---------------------------------------------------------------------------
routines.post(
  "/:day/items",
  csrfMiddleware,
  zValidator("form", RoutineItemSchema, (result, c) => {
    if (!result.success) return c.redirect(`/routines/${c.req.param("day")}`, 302);
  }),
  async (c) => {
    const dayParam = parseDay(c.req.param("day"));
    if (dayParam === null) return c.notFound();

    const userId = c.get("userId");
    const { lift_name, reps_min, reps_max, sets } = c.req.valid("form");
    const routine = await getOrCreateRoutine(c.env.DB, userId, dayParam);

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
// POST /routines/:day/items/:id — update a lift
// ---------------------------------------------------------------------------
routines.post(
  "/:day/items/:id",
  csrfMiddleware,
  zValidator("form", RoutineItemSchema, (result, c) => {
    if (!result.success) return c.redirect(`/routines/${c.req.param("day")}`, 302);
  }),
  async (c) => {
    const dayParam = parseDay(c.req.param("day"));
    if (dayParam === null) return c.notFound();

    const userId = c.get("userId");
    const itemId = c.req.param("id");
    const { lift_name, reps_min, reps_max, sets } = c.req.valid("form");
    const routine = await getOrCreateRoutine(c.env.DB, userId, dayParam);

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
// POST /routines/:day/items/:id/delete — remove a lift
// ---------------------------------------------------------------------------
routines.post("/:day/items/:id/delete", csrfMiddleware, async (c) => {
  const dayParam = parseDay(c.req.param("day"));
  if (dayParam === null) return c.notFound();

  const userId = c.get("userId");
  const itemId = c.req.param("id");
  const routine = await getOrCreateRoutine(c.env.DB, userId, dayParam);

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
// POST /routines/:day/items/:id/move — reorder a lift or superset group
// ---------------------------------------------------------------------------
routines.post("/:day/items/:id/move", csrfMiddleware, async (c) => {
  const dayParam = parseDay(c.req.param("day"));
  if (dayParam === null) return c.notFound();

  const userId = c.get("userId");
  const itemId = c.req.param("id");
  const body = await c.req.parseBody();
  const direction = body.direction as string;
  if (direction !== "up" && direction !== "down") return c.notFound();

  const routine = await getOrCreateRoutine(c.env.DB, userId, dayParam);
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
// POST /routines/:day/superset — group checked items into a superset
// ---------------------------------------------------------------------------
routines.post("/:day/superset", csrfMiddleware, async (c) => {
  const dayParam = parseDay(c.req.param("day"));
  if (dayParam === null) return c.notFound();

  const userId = c.get("userId");
  const routine = await getOrCreateRoutine(c.env.DB, userId, dayParam);
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
// POST /routines/:day/items/:id/unsuperset — remove a lift from its superset
// ---------------------------------------------------------------------------
routines.post("/:day/items/:id/unsuperset", csrfMiddleware, async (c) => {
  const dayParam = parseDay(c.req.param("day"));
  if (dayParam === null) return c.notFound();

  const userId = c.get("userId");
  const itemId = c.req.param("id");
  const routine = await getOrCreateRoutine(c.env.DB, userId, dayParam);

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
