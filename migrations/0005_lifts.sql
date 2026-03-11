CREATE TABLE lifts (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL UNIQUE,
  reverse_volume  INTEGER NOT NULL DEFAULT 0,
  attributes_json TEXT,
  created_at      INTEGER NOT NULL
);
