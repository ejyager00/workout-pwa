import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { csrfMiddleware } from "../middleware/csrf";
import { ensureCsrfCookie } from "../lib/csrf";
import { render } from "../lib/render";
import { createWorkout, replaceWorkout, getWorkout, listWorkoutsPage, type WorkoutInput } from "../lib/workouts";
import type { Env, User } from "../types";

const workouts = new Hono<{
  Bindings: Env;
  Variables: { userId: string; user: User };
}>();

workouts.use("*", authMiddleware);

// ---------------------------------------------------------------------------
// GET /workouts — history list
// ---------------------------------------------------------------------------
workouts.get("/", async (c) => {
  const userId = c.get("userId");
  const cursorParam = c.req.query("cursor");
  let cursor: { date: string; id: string } | undefined;
  if (cursorParam) {
    try {
      cursor = JSON.parse(atob(cursorParam)) as { date: string; id: string };
    } catch {
      // ignore invalid cursor
    }
  }

  const { workouts: items, nextCursor } = await listWorkoutsPage(c.env.DB, userId, 20, cursor);
  const nextCursorEncoded = nextCursor ? btoa(JSON.stringify(nextCursor)) : null;

  const isHtmx = c.req.header("HX-Request") === "true";
  if (isHtmx && cursor) {
    // Load-more request: return only the list items fragment
    return c.html(
      render("partials/workouts/list-items.njk", {
        workouts: items,
        nextCursor: nextCursorEncoded,
      })
    );
  }

  return c.html(
    render("pages/workouts/list.njk", {
      title: "Workout History",
      user: c.get("user"),
      workouts: items,
      nextCursor: nextCursorEncoded,
    })
  );
});

// ---------------------------------------------------------------------------
// GET /workouts/:id/detail — htmx expand partial
// ---------------------------------------------------------------------------
workouts.get("/:id/detail", async (c) => {
  const userId = c.get("userId");
  const workoutId = c.req.param("id");
  const workout = await getWorkout(c.env.DB, userId, workoutId);
  if (!workout) return c.text("Not found", 404);

  // Group lifts by superset for display
  const groups = groupWorkoutLifts(workout.lifts);

  return c.html(render("partials/workouts/detail.njk", { workout, groups }));
});

// ---------------------------------------------------------------------------
// GET /workouts/:id/edit — edit form
// ---------------------------------------------------------------------------
workouts.get("/:id/edit", async (c) => {
  const csrfToken = ensureCsrfCookie(c);
  const userId = c.get("userId");
  const workoutId = c.req.param("id");
  const workout = await getWorkout(c.env.DB, userId, workoutId);
  if (!workout) return c.redirect("/workouts", 302);

  return c.html(
    render("pages/workouts/edit.njk", {
      title: "Edit Workout",
      csrfToken,
      user: c.get("user"),
      workout,
      workoutJson: JSON.stringify(workout),
      error: null,
    })
  );
});

// ---------------------------------------------------------------------------
// POST /workouts/:id/edit — process edit
// ---------------------------------------------------------------------------
workouts.post("/:id/edit", csrfMiddleware, async (c) => {
  const userId = c.get("userId");
  const workoutId = c.req.param("id");
  const body = await c.req.parseBody({ all: true });
  const parsed = parseWorkoutForm(body as Record<string, string | string[]>);

  if (!parsed) {
    const csrfToken = ensureCsrfCookie(c);
    const workout = await getWorkout(c.env.DB, userId, workoutId);
    if (!workout) return c.redirect("/workouts", 302);
    return c.html(
      render("pages/workouts/edit.njk", {
        title: "Edit Workout",
        csrfToken,
        user: c.get("user"),
        workout,
        workoutJson: JSON.stringify(workout),
        error: "Please add at least one lift with a valid set.",
      }),
      400
    );
  }

  const replaced = await replaceWorkout(c.env.DB, userId, workoutId, parsed);
  if (!replaced) return c.redirect("/workouts", 302);

  return c.redirect("/workouts", 302);
});

// ---------------------------------------------------------------------------
// GET /workouts/new
// ---------------------------------------------------------------------------
workouts.get("/new", (c) => {
  const csrfToken = ensureCsrfCookie(c);
  const today = new Date().toISOString().split("T")[0];
  return c.html(
    render("pages/workouts/new.njk", {
      title: "Log Workout",
      csrfToken,
      user: c.get("user"),
      today,
      error: null,
    })
  );
});

// ---------------------------------------------------------------------------
// POST /workouts/new
// ---------------------------------------------------------------------------
workouts.post("/new", csrfMiddleware, async (c) => {
  const body = await c.req.parseBody({ all: true });

  const parsed = parseWorkoutForm(body as Record<string, string | string[]>);

  if (!parsed) {
    const csrfToken = ensureCsrfCookie(c);
    const today = new Date().toISOString().split("T")[0];
    return c.html(
      render("pages/workouts/new.njk", {
        title: "Log Workout",
        csrfToken,
        user: c.get("user"),
        today,
        error: "Please add at least one lift with a valid set.",
      }),
      400
    );
  }

  const userId = c.get("userId");
  await createWorkout(c.env.DB, userId, parsed);

  return c.redirect("/workouts", 302);
});

// ---------------------------------------------------------------------------
// Form parser
// ---------------------------------------------------------------------------

function parseWorkoutForm(
  body: Record<string, string | string[]>
): WorkoutInput | null {
  const toArr = (v: string | string[] | undefined): string[] => {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  const liftNames = toArr(body["lift_name[]"]);
  const liftSupersets = toArr(body["lift_superset[]"]);
  const setLiftIdxs = toArr(body["set_lift[]"]);
  const setReps = toArr(body["set_reps[]"]);
  const setWeights = toArr(body["set_weight[]"]);

  if (liftNames.length === 0) return null;

  interface LiftData {
    lift_name: string;
    superset_id: string | null;
    position: number;
    sets: { set_number: number; reps: number; weight: number }[];
  }

  const lifts: LiftData[] = liftNames.map((name, idx) => ({
    lift_name: name.trim(),
    superset_id: liftSupersets[idx]?.trim() || null,
    position: idx,
    sets: [],
  }));

  const setCountPerLift = new Array(lifts.length).fill(0);
  for (let i = 0; i < setLiftIdxs.length; i++) {
    const liftIdx = parseInt(setLiftIdxs[i]);
    if (isNaN(liftIdx) || liftIdx < 0 || liftIdx >= lifts.length) continue;
    const reps = parseInt(setReps[i] ?? "");
    const weight = parseFloat(setWeights[i] ?? "");
    if (isNaN(reps) || isNaN(weight)) continue;
    setCountPerLift[liftIdx]++;
    lifts[liftIdx].sets.push({ set_number: setCountPerLift[liftIdx], reps, weight });
  }

  const validLifts = lifts.filter((l) => l.sets.length > 0 && l.lift_name);
  if (validLifts.length === 0) return null;

  const date =
    (body["date"] as string)?.match(/^\d{4}-\d{2}-\d{2}$/)
      ? (body["date"] as string)
      : new Date().toISOString().split("T")[0];

  return {
    date,
    notes: (body["notes"] as string)?.trim() || undefined,
    lifts: validLifts,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type WorkoutLift = {
  id: string;
  workout_id: string;
  superset_id: string | null;
  position: number;
  lift_name: string;
  created_at: number;
  sets: { id: string; workout_lift_id: string; set_number: number; reps: number; weight: number; created_at: number }[];
};

interface LiftGroup {
  type: "standalone" | "superset";
  superset_id: string | null;
  lifts: WorkoutLift[];
}

function groupWorkoutLifts(lifts: WorkoutLift[]): LiftGroup[] {
  const groups: LiftGroup[] = [];
  const ssMap = new Map<string, LiftGroup>();
  for (const lift of lifts) {
    if (!lift.superset_id) {
      groups.push({ type: "standalone", superset_id: null, lifts: [lift] });
    } else {
      if (!ssMap.has(lift.superset_id)) {
        const g: LiftGroup = { type: "superset", superset_id: lift.superset_id, lifts: [] };
        ssMap.set(lift.superset_id, g);
        groups.push(g);
      }
      ssMap.get(lift.superset_id)!.lifts.push(lift);
    }
  }
  return groups;
}

export default workouts;
