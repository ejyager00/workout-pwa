-- Migration: 0006_routine_library
-- Decouple routines from weekdays.
--
-- Previously `routines` WAS the schedule: UNIQUE(user_id, weekday) meant a user
-- could have at most one routine per day and no way to keep an alternate around
-- (e.g. the same session adapted for different equipment). This splits the two
-- concepts: `routines` is now a named, reusable list of lifts with no weekday of
-- its own, and `routine_schedule` maps each weekday to one of them. A weekday
-- with no schedule row is a rest day; one routine may be scheduled on many days.

PRAGMA defer_foreign_keys = on;

-- 1. Stash the existing weekday assignments before the weekday column goes away.
CREATE TABLE _schedule_seed AS
  SELECT user_id, weekday, id AS routine_id, updated_at FROM routines;

-- 2. Names become the primary identifier in the UI, so backfill the blank ones.
UPDATE routines SET name = CASE weekday
    WHEN 0 THEN 'Sunday Routine'
    WHEN 1 THEN 'Monday Routine'
    WHEN 2 THEN 'Tuesday Routine'
    WHEN 3 THEN 'Wednesday Routine'
    WHEN 4 THEN 'Thursday Routine'
    WHEN 5 THEN 'Friday Routine'
    ELSE 'Saturday Routine'
  END
  WHERE name = '';

-- 3. Rebuild `routines` without `weekday`. SQLite cannot DROP COLUMN here (the
--    column sits inside a UNIQUE table constraint), and DROP TABLE on a parent
--    fires ON DELETE CASCADE / SET NULL against its children when foreign keys
--    are enforced, so the child rows are staged and restored around the rebuild.
--    Routine ids are preserved: routine_items and daily_overrides point at them.
CREATE TABLE _routine_items_backup   AS SELECT * FROM routine_items;
CREATE TABLE _daily_overrides_backup AS SELECT * FROM daily_overrides;

CREATE TABLE routines_new (
  id         TEXT    PRIMARY KEY,
  user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT    NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
INSERT INTO routines_new (id, user_id, name, created_at, updated_at)
  SELECT id, user_id, name, created_at, updated_at FROM routines;

DROP TABLE routines;
ALTER TABLE routines_new RENAME TO routines;
CREATE INDEX IF NOT EXISTS idx_routines_user ON routines(user_id, name);

DELETE FROM routine_items;
INSERT INTO routine_items SELECT * FROM _routine_items_backup;
DELETE FROM daily_overrides;
INSERT INTO daily_overrides SELECT * FROM _daily_overrides_backup;

DROP TABLE _routine_items_backup;
DROP TABLE _daily_overrides_backup;

-- 4. Weekday -> routine mapping. Created after the rebuild so its foreign key
--    resolves against the new table and the seeded rows survive the DROP above.
CREATE TABLE routine_schedule (
  user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weekday    INTEGER NOT NULL CHECK(weekday BETWEEN 0 AND 6),
  routine_id TEXT    NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, weekday)
);
CREATE INDEX IF NOT EXISTS idx_routine_schedule_routine ON routine_schedule(routine_id);

INSERT INTO routine_schedule (user_id, weekday, routine_id, updated_at)
  SELECT user_id, weekday, routine_id, updated_at FROM _schedule_seed;

DROP TABLE _schedule_seed;
