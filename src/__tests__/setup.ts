/**
 * Global test setup — runs inside the workerd environment before each test file.
 * Applies the D1 schema so every test suite starts with the correct tables.
 */
import { env } from "cloudflare:test";
import { beforeAll } from "vitest";

beforeAll(async () => {
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at INTEGER NOT NULL)"
  ).run();
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)"
  ).run();
  await env.DB.prepare(
    "CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)"
  ).run();

  // Workout domain tables, matching the schema after migrations/0006.
  const workoutTables = [
    "CREATE TABLE IF NOT EXISTS routines (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, name TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)",
    "CREATE TABLE IF NOT EXISTS routine_items (id TEXT PRIMARY KEY, routine_id TEXT NOT NULL REFERENCES routines(id) ON DELETE CASCADE, superset_id TEXT, position INTEGER NOT NULL, lift_name TEXT NOT NULL, reps_min INTEGER NOT NULL, reps_max INTEGER NOT NULL, sets INTEGER NOT NULL, created_at INTEGER NOT NULL)",
    "CREATE TABLE IF NOT EXISTS routine_schedule (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, weekday INTEGER NOT NULL CHECK(weekday BETWEEN 0 AND 6), routine_id TEXT NOT NULL REFERENCES routines(id) ON DELETE CASCADE, updated_at INTEGER NOT NULL, PRIMARY KEY (user_id, weekday))",
    "CREATE TABLE IF NOT EXISTS daily_overrides (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, date TEXT NOT NULL, routine_id TEXT REFERENCES routines(id) ON DELETE SET NULL, items_json TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, UNIQUE(user_id, date))",
    "CREATE TABLE IF NOT EXISTS workouts (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, date TEXT NOT NULL, notes TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)",
    "CREATE TABLE IF NOT EXISTS workout_lifts (id TEXT PRIMARY KEY, workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE, superset_id TEXT, position INTEGER NOT NULL, lift_name TEXT NOT NULL, created_at INTEGER NOT NULL)",
    "CREATE TABLE IF NOT EXISTS workout_sets (id TEXT PRIMARY KEY, workout_lift_id TEXT NOT NULL REFERENCES workout_lifts(id) ON DELETE CASCADE, set_number INTEGER NOT NULL, reps INTEGER NOT NULL, weight REAL NOT NULL, created_at INTEGER NOT NULL)",
    "CREATE TABLE IF NOT EXISTS lift_stats (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, lift_name TEXT NOT NULL, recent_date TEXT, recent_sets_json TEXT, best_volume REAL, best_date TEXT, best_sets_json TEXT, updated_at INTEGER NOT NULL, PRIMARY KEY(user_id, lift_name))",
    "CREATE TABLE IF NOT EXISTS lifts (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, reverse_volume INTEGER NOT NULL DEFAULT 0, attributes_json TEXT, created_at INTEGER NOT NULL)",
    "CREATE TABLE IF NOT EXISTS user_settings (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, inline_logging INTEGER NOT NULL DEFAULT 0, webhook_url TEXT, dark_mode INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL)",
  ];
  for (const sql of workoutTables) {
    await env.DB.prepare(sql).run();
  }
});
