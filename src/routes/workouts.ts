import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { csrfMiddleware } from "../middleware/csrf";
import { ensureCsrfCookie } from "../lib/csrf";
import { render } from "../lib/render";
import { createWorkout, type WorkoutInput } from "../lib/workouts";
import type { Env, User } from "../types";

const workouts = new Hono<{
  Bindings: Env;
  Variables: { userId: string; user: User };
}>();

workouts.use("*", authMiddleware);

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

  return c.redirect("/", 302);
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

export default workouts;
