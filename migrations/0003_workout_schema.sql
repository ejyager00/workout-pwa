-- Migration: 0003_workout_schema
-- Workout PWA domain tables

-- Routines: one per user per weekday (0=Sun … 6=Sat)
CREATE TABLE IF NOT EXISTS routines (
  id         TEXT    PRIMARY KEY,
  user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weekday    INTEGER NOT NULL CHECK(weekday BETWEEN 0 AND 6),
  name       TEXT    NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_id, weekday)
);

-- Routine items: each row is a lift within a routine
-- superset_id IS NULL = standalone lift; shared UUID = grouped into a superset
-- position orders items within the routine (or within a superset group)
CREATE TABLE IF NOT EXISTS routine_items (
  id          TEXT    PRIMARY KEY,
  routine_id  TEXT    NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  superset_id TEXT,
  position    INTEGER NOT NULL,
  lift_name   TEXT    NOT NULL,
  reps_min    INTEGER NOT NULL,
  reps_max    INTEGER NOT NULL,
  sets        INTEGER NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_routine_items_routine ON routine_items(routine_id, position);

-- Daily overrides: per-day customizations to a routine stored as a JSON blob
-- Auto-expired when a new week's occurrence of that weekday arrives
CREATE TABLE IF NOT EXISTS daily_overrides (
  id         TEXT    PRIMARY KEY,
  user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date       TEXT    NOT NULL,  -- ISO date "YYYY-MM-DD"
  routine_id TEXT    REFERENCES routines(id) ON DELETE SET NULL,
  items_json TEXT    NOT NULL,  -- JSON: ordered array of routine_item-like objects
  completed  INTEGER NOT NULL DEFAULT 0,  -- 1 = workout marked complete
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_id, date)
);

-- Workouts: completed workout sessions
CREATE TABLE IF NOT EXISTS workouts (
  id         TEXT    PRIMARY KEY,
  user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date       TEXT    NOT NULL,  -- ISO date "YYYY-MM-DD"
  notes      TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, date);

-- Workout lifts: each lift entry within a completed workout
CREATE TABLE IF NOT EXISTS workout_lifts (
  id          TEXT    PRIMARY KEY,
  workout_id  TEXT    NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  superset_id TEXT,
  position    INTEGER NOT NULL,
  lift_name   TEXT    NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_workout_lifts_workout ON workout_lifts(workout_id, position);

-- Workout sets: individual sets for a workout lift (weights stored in lbs)
CREATE TABLE IF NOT EXISTS workout_sets (
  id              TEXT    PRIMARY KEY,
  workout_lift_id TEXT    NOT NULL REFERENCES workout_lifts(id) ON DELETE CASCADE,
  set_number      INTEGER NOT NULL,
  reps            INTEGER NOT NULL,
  weight          REAL    NOT NULL,
  created_at      INTEGER NOT NULL
);

-- Lift performance cache: best-ever and most-recent per (user_id, lift_name)
-- Updated in a D1 transaction on every workout write that includes that lift
-- best_volume = max(reps * weight) across sets in a single session (not sum)
CREATE TABLE IF NOT EXISTS lift_stats (
  user_id          TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lift_name        TEXT    NOT NULL,
  recent_date      TEXT,           -- ISO date of most recent workout containing this lift
  recent_sets_json TEXT,           -- JSON: [{reps, weight}, ...]
  best_volume      REAL,           -- max(reps * weight) across sets in the best session
  best_date        TEXT,           -- ISO date of the best_volume session
  best_sets_json   TEXT,           -- JSON: [{reps, weight}, ...] for the best session
  updated_at       INTEGER NOT NULL,
  PRIMARY KEY(user_id, lift_name)
);

-- API keys: for external workout submission via Authorization: ApiKey <key>
-- key_hash is SHA-256 of the actual key — the plaintext is never stored
CREATE TABLE IF NOT EXISTS api_keys (
  id         TEXT    PRIMARY KEY,
  user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash   TEXT    NOT NULL UNIQUE,
  name       TEXT    NOT NULL,
  created_at INTEGER NOT NULL,
  last_used  INTEGER
);

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id        TEXT    PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  inline_logging INTEGER NOT NULL DEFAULT 0,  -- 1 = enabled
  webhook_url    TEXT,
  updated_at     INTEGER NOT NULL
);
