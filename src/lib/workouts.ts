/**
 * Shared workout service used by both the JSON API and the web UI.
 * Handles create, replace, delete, and get, plus lift_stats cache updates.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WorkoutSetInput {
  set_number: number;
  reps: number;
  weight: number; // lbs
}

export interface WorkoutLiftInput {
  lift_name: string;
  superset_id: string | null;
  position: number;
  sets: WorkoutSetInput[];
}

export interface WorkoutInput {
  date: string; // "YYYY-MM-DD"
  notes?: string;
  lifts: WorkoutLiftInput[];
}

interface WorkoutRow {
  id: string;
  user_id: string;
  date: string;
  notes: string | null;
  created_at: number;
  updated_at: number;
}

interface WorkoutLiftRow {
  id: string;
  workout_id: string;
  superset_id: string | null;
  position: number;
  lift_name: string;
  created_at: number;
}

interface WorkoutSetRow {
  id: string;
  workout_lift_id: string;
  set_number: number;
  reps: number;
  weight: number;
  created_at: number;
}

// ---------------------------------------------------------------------------
// lift_stats cache
// ---------------------------------------------------------------------------

/**
 * Recalculates and upserts lift_stats for each lift name.
 * best_volume = max(reps * weight) over all sets in a single session.
 * Called inside (or immediately after) a batch, per-lift.
 */
async function updateLiftStats(
  db: D1Database,
  userId: string,
  liftNames: string[]
): Promise<void> {
  for (const rawName of liftNames) {
    const liftName = rawName.toLowerCase();
    // Fetch every set for this lift across all workouts for this user (case-insensitive)
    const rows = await db
      .prepare(
        `SELECT w.id AS workout_id, w.date, ws.reps, ws.weight
         FROM workout_sets ws
         JOIN workout_lifts wl ON wl.id = ws.workout_lift_id
         JOIN workouts w ON w.id = wl.workout_id
         WHERE w.user_id = ? AND LOWER(wl.lift_name) = ?
         ORDER BY w.date DESC`
      )
      .bind(userId, liftName)
      .all<{ workout_id: string; date: string; reps: number; weight: number }>();

    if (rows.results.length === 0) {
      // No data — clear any existing cache entry
      await db
        .prepare("DELETE FROM lift_stats WHERE user_id = ? AND lift_name = ?")
        .bind(userId, liftName)
        .run();
      continue;
    }

    // Group sets by workout session
    const byWorkout = new Map<
      string,
      { date: string; sets: { reps: number; weight: number }[] }
    >();
    for (const row of rows.results) {
      if (!byWorkout.has(row.workout_id)) {
        byWorkout.set(row.workout_id, { date: row.date, sets: [] });
      }
      byWorkout.get(row.workout_id)!.sets.push({ reps: row.reps, weight: row.weight });
    }

    let recentDate = "";
    let recentSets: { reps: number; weight: number }[] = [];
    let bestVolume = 0;
    let bestDate = "";
    let bestSets: { reps: number; weight: number }[] = [];

    for (const entry of byWorkout.values()) {
      if (entry.date > recentDate) {
        recentDate = entry.date;
        recentSets = entry.sets;
      }
      const sessionBest = Math.max(...entry.sets.map((s) => s.reps * s.weight));
      if (sessionBest > bestVolume) {
        bestVolume = sessionBest;
        bestDate = entry.date;
        bestSets = entry.sets;
      }
    }

    await db
      .prepare(
        `INSERT INTO lift_stats
           (user_id, lift_name, recent_date, recent_sets_json,
            best_volume, best_date, best_sets_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, lift_name) DO UPDATE SET
           recent_date      = excluded.recent_date,
           recent_sets_json = excluded.recent_sets_json,
           best_volume      = excluded.best_volume,
           best_date        = excluded.best_date,
           best_sets_json   = excluded.best_sets_json,
           updated_at       = excluded.updated_at`
      )
      .bind(
        userId,
        liftName,
        recentDate,
        JSON.stringify(recentSets),
        bestVolume,
        bestDate,
        JSON.stringify(bestSets),
        Math.floor(Date.now() / 1000)
      )
      .run();
  }
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/** Creates a workout and updates lift_stats. Returns the new workout ID. */
export async function createWorkout(
  db: D1Database,
  userId: string,
  data: WorkoutInput
): Promise<string> {
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  const stmts: D1PreparedStatement[] = [
    db
      .prepare(
        "INSERT INTO workouts (id, user_id, date, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .bind(id, userId, data.date, data.notes ?? null, now, now),
  ];

  for (const lift of data.lifts) {
    const liftId = crypto.randomUUID();
    stmts.push(
      db
        .prepare(
          "INSERT INTO workout_lifts (id, workout_id, superset_id, position, lift_name, created_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(liftId, id, lift.superset_id ?? null, lift.position, lift.lift_name.toLowerCase(), now)
    );
    for (const set of lift.sets) {
      stmts.push(
        db
          .prepare(
            "INSERT INTO workout_sets (id, workout_lift_id, set_number, reps, weight, created_at) VALUES (?, ?, ?, ?, ?, ?)"
          )
          .bind(crypto.randomUUID(), liftId, set.set_number, set.reps, set.weight, now)
      );
    }
  }

  await db.batch(stmts);

  const liftNames = [...new Set(data.lifts.map((l) => l.lift_name))];
  await updateLiftStats(db, userId, liftNames);

  return id;
}

/**
 * Fully replaces a workout (PUT semantics).
 * Deletes and reinserts all lifts/sets, then refreshes lift_stats for both
 * old and new lift names.
 */
export async function replaceWorkout(
  db: D1Database,
  userId: string,
  workoutId: string,
  data: WorkoutInput
): Promise<boolean> {
  const existing = await db
    .prepare("SELECT id FROM workouts WHERE id = ? AND user_id = ?")
    .bind(workoutId, userId)
    .first();
  if (!existing) return false;

  const oldLifts = await db
    .prepare("SELECT lift_name FROM workout_lifts WHERE workout_id = ?")
    .bind(workoutId)
    .all<{ lift_name: string }>();
  const oldLiftNames = oldLifts.results.map((l) => l.lift_name);

  const now = Math.floor(Date.now() / 1000);

  const stmts: D1PreparedStatement[] = [
    db
      .prepare("DELETE FROM workout_lifts WHERE workout_id = ?")
      .bind(workoutId),
    db
      .prepare(
        "UPDATE workouts SET date = ?, notes = ?, updated_at = ? WHERE id = ?"
      )
      .bind(data.date, data.notes ?? null, now, workoutId),
  ];

  for (const lift of data.lifts) {
    const liftId = crypto.randomUUID();
    stmts.push(
      db
        .prepare(
          "INSERT INTO workout_lifts (id, workout_id, superset_id, position, lift_name, created_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(liftId, workoutId, lift.superset_id ?? null, lift.position, lift.lift_name.toLowerCase(), now)
    );
    for (const set of lift.sets) {
      stmts.push(
        db
          .prepare(
            "INSERT INTO workout_sets (id, workout_lift_id, set_number, reps, weight, created_at) VALUES (?, ?, ?, ?, ?, ?)"
          )
          .bind(crypto.randomUUID(), liftId, set.set_number, set.reps, set.weight, now)
      );
    }
  }

  await db.batch(stmts);

  const allLiftNames = [...new Set([...oldLiftNames, ...data.lifts.map((l) => l.lift_name)])];
  await updateLiftStats(db, userId, allLiftNames);

  return true;
}

/** Deletes a workout. Returns false if not found / not owned by userId. */
export async function deleteWorkout(
  db: D1Database,
  userId: string,
  workoutId: string
): Promise<boolean> {
  const existing = await db
    .prepare("SELECT id FROM workouts WHERE id = ? AND user_id = ?")
    .bind(workoutId, userId)
    .first();
  if (!existing) return false;

  await db.prepare("DELETE FROM workouts WHERE id = ?").bind(workoutId).run();
  return true;
}

/** Gets a single workout with all lifts and sets. Returns null if not found. */
export async function getWorkout(
  db: D1Database,
  userId: string,
  workoutId: string
) {
  const workout = await db
    .prepare("SELECT * FROM workouts WHERE id = ? AND user_id = ?")
    .bind(workoutId, userId)
    .first<WorkoutRow>();
  if (!workout) return null;

  const lifts = await db
    .prepare(
      "SELECT * FROM workout_lifts WHERE workout_id = ? ORDER BY position"
    )
    .bind(workoutId)
    .all<WorkoutLiftRow>();

  const sets = await db
    .prepare(
      `SELECT ws.* FROM workout_sets ws
       JOIN workout_lifts wl ON wl.id = ws.workout_lift_id
       WHERE wl.workout_id = ?
       ORDER BY wl.position, ws.set_number`
    )
    .bind(workoutId)
    .all<WorkoutSetRow>();

  const setsByLift = new Map<string, WorkoutSetRow[]>();
  for (const set of sets.results) {
    if (!setsByLift.has(set.workout_lift_id)) {
      setsByLift.set(set.workout_lift_id, []);
    }
    setsByLift.get(set.workout_lift_id)!.push(set);
  }

  return {
    ...workout,
    lifts: lifts.results.map((lift) => ({
      ...lift,
      sets: setsByLift.get(lift.id) ?? [],
    })),
  };
}

/** Lists workouts for a user with simple offset pagination. */
export async function listWorkouts(
  db: D1Database,
  userId: string,
  page: number,
  limit: number
) {
  const offset = (page - 1) * limit;

  const [rows, countRow] = await Promise.all([
    db
      .prepare(
        "SELECT id, date, notes, created_at, updated_at FROM workouts WHERE user_id = ? ORDER BY date DESC, created_at DESC LIMIT ? OFFSET ?"
      )
      .bind(userId, limit, offset)
      .all<Omit<WorkoutRow, "user_id">>(),
    db
      .prepare("SELECT COUNT(*) as total FROM workouts WHERE user_id = ?")
      .bind(userId)
      .first<{ total: number }>(),
  ]);

  return {
    workouts: rows.results,
    page,
    limit,
    total: countRow?.total ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Historical workout list (web UI)
// ---------------------------------------------------------------------------

export interface WorkoutSummary {
  id: string;
  date: string;
  formatted_date: string;
  notes: string | null;
  lift_names: string | null;
  total_sets: number;
}

function formatWorkoutDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getUTCDay()]} ${months[d.getUTCMonth()]} ${day}`;
}

/**
 * Lists workouts for the history page UI with cursor-based pagination.
 * Includes a summary of lift names and total set count per workout.
 */
export async function listWorkoutsPage(
  db: D1Database,
  userId: string,
  limit: number,
  cursor?: { date: string; id: string }
): Promise<{ workouts: WorkoutSummary[]; nextCursor: { date: string; id: string } | null }> {
  const cursorFilter = cursor
    ? "AND (w.date < ? OR (w.date = ? AND w.id < ?))"
    : "";
  const cursorBinds: (string | number)[] = cursor
    ? [cursor.date, cursor.date, cursor.id]
    : [];

  const rows = await db
    .prepare(
      `SELECT
         w.id, w.date, w.notes,
         (SELECT GROUP_CONCAT(lift_name, ' · ')
          FROM (SELECT lift_name FROM workout_lifts WHERE workout_id = w.id ORDER BY position)
         ) as lift_names,
         (SELECT COUNT(*)
          FROM workout_sets ws
          JOIN workout_lifts wl ON wl.id = ws.workout_lift_id
          WHERE wl.workout_id = w.id
         ) as total_sets
       FROM workouts w
       WHERE w.user_id = ? ${cursorFilter}
       ORDER BY w.date DESC, w.id DESC
       LIMIT ?`
    )
    .bind(userId, ...cursorBinds, limit + 1)
    .all<Omit<WorkoutSummary, "formatted_date">>();

  const hasMore = rows.results.length > limit;
  const items = hasMore ? rows.results.slice(0, limit) : rows.results;
  const nextCursor = hasMore
    ? { date: items[items.length - 1].date, id: items[items.length - 1].id }
    : null;

  return {
    workouts: items.map((w) => ({ ...w, formatted_date: formatWorkoutDate(w.date) })),
    nextCursor,
  };
}
