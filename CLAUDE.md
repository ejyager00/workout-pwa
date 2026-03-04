# Workout PWA — Build Guide for Claude

## Project Overview

A mobile-first, progressive web app for strength training tracking. Built on Cloudflare Workers with D1 (SQLite), Hono, Nunjucks templates, and htmx. The existing template (notes CRUD + auth) is the starting point — extend it, don't replace it.

---

## Tech Stack

- **Runtime**: Cloudflare Workers (TypeScript, `nodejs_compat`)
- **Router**: Hono
- **Templates**: Nunjucks (server-side HTML) — keep using `.njk` files in `src/templates/`
- **Interactivity**: htmx — return HTML fragments from the server, swap into the DOM
- **Database**: D1 (SQLite at the edge) — all relational data
- **Sessions/Auth**: KV (`SESSIONS` binding) for JWT refresh tokens and denylist
- **Styles**: Existing `app.css` in `public/` — extend it, mobile-first
- **PWA**: `manifest.json` + `sw.js` already in `public/` — enhance for offline

---

## Application Routes

| Route | Purpose |
|-------|---------|
| `/` | Home / workout page — today's routine with inline logging |
| `/routines` | Manage weekly routines (one per day of week) |
| `/routines/:day` | Edit a specific day's routine |
| `/workouts/new` | Dedicated workout entry page |
| `/settings` | User settings (inline logging toggle, webhook URL, API key management) |
| `/auth/*` | Existing auth routes — keep as-is |
| `/api/workouts` | Public CRUD API (JWT or API key auth) |

---

## Data Model

### Schema Design

```sql
-- Routines: one per user per weekday (0=Sun … 6=Sat)
CREATE TABLE routines (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weekday    INTEGER NOT NULL CHECK(weekday BETWEEN 0 AND 6),
  name       TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_id, weekday)
);

-- Routine items: each row is a lift OR a superset group header
-- Items within the same superset share a superset_id (UUID)
-- superset_id IS NULL means the lift is standalone
-- position orders items within a routine (or within a superset)
CREATE TABLE routine_items (
  id           TEXT PRIMARY KEY,
  routine_id   TEXT NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
  superset_id  TEXT,              -- NULL = standalone; shared UUID = grouped superset
  position     INTEGER NOT NULL,  -- ordering within routine (or within superset group)
  lift_name    TEXT NOT NULL,     -- free text for MVP; foreign key to lifts table later
  reps_min     INTEGER NOT NULL,
  reps_max     INTEGER NOT NULL,
  sets         INTEGER NOT NULL,
  created_at   INTEGER NOT NULL
);
CREATE INDEX idx_routine_items_routine ON routine_items(routine_id, position);

-- Daily overrides: per-day customizations to a routine
-- Stored as a JSON blob (ordered array of lift configs) keyed by (user_id, date)
-- Auto-expired: cleaned up when a new week's occurrence of that weekday arrives
CREATE TABLE daily_overrides (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date       TEXT NOT NULL,      -- ISO date string "YYYY-MM-DD"
  routine_id TEXT REFERENCES routines(id) ON DELETE SET NULL,
  items_json TEXT NOT NULL,      -- JSON: ordered list of routine_item-like objects
  completed  INTEGER NOT NULL DEFAULT 0,  -- 1 = workout marked complete
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_id, date)
);

-- Workouts: completed workout sessions
CREATE TABLE workouts (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date       TEXT NOT NULL,      -- ISO date string "YYYY-MM-DD"
  notes      TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_workouts_user_date ON workouts(user_id, date);

-- Workout lifts: each lift entry within a workout
CREATE TABLE workout_lifts (
  id          TEXT PRIMARY KEY,
  workout_id  TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  superset_id TEXT,              -- NULL = standalone; shared UUID = superset group
  position    INTEGER NOT NULL,
  lift_name   TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);
CREATE INDEX idx_workout_lifts_workout ON workout_lifts(workout_id, position);

-- Workout sets: individual sets for a workout lift
CREATE TABLE workout_sets (
  id              TEXT PRIMARY KEY,
  workout_lift_id TEXT NOT NULL REFERENCES workout_lifts(id) ON DELETE CASCADE,
  set_number      INTEGER NOT NULL,
  reps            INTEGER NOT NULL,
  weight          REAL NOT NULL,   -- store in user's preferred unit (lbs or kg)
  created_at      INTEGER NOT NULL
);

-- Lift performance cache: best-ever and most-recent per (user, lift_name)
-- Updated on every workout write that includes that lift
CREATE TABLE lift_stats (
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lift_name        TEXT NOT NULL,
  recent_date      TEXT,          -- ISO date of most recent workout containing this lift
  recent_sets_json TEXT,          -- JSON: [{reps, weight}, ...]
  best_volume      REAL,          -- max dot-product(reps[], weights[]) across all sets in one session
  best_date        TEXT,          -- ISO date of the best_volume session
  best_sets_json   TEXT,          -- JSON: [{reps, weight}, ...] for the best session
  updated_at       INTEGER NOT NULL,
  PRIMARY KEY(user_id, lift_name)
);

-- API keys: for external workout submission
CREATE TABLE api_keys (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash   TEXT NOT NULL UNIQUE,  -- SHA-256 hash of the actual key
  name       TEXT NOT NULL,         -- user-given label (e.g. "Garmin sync")
  created_at INTEGER NOT NULL,
  last_used  INTEGER
);

-- User settings
CREATE TABLE user_settings (
  user_id              TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  inline_logging       INTEGER NOT NULL DEFAULT 0,  -- 1 = enabled
  webhook_url          TEXT,                         -- single outbound webhook after workout complete
  updated_at           INTEGER NOT NULL
);
```

### Superset Design

Supersets are modeled by a shared `superset_id` UUID on sibling rows in `routine_items` or `workout_lifts`. There is no separate superset table. To render:
- Group items by `superset_id` (where not null)
- Order groups/standalone items by the minimum `position` within each group
- Order items within a group by their own `position`

Max lifts per superset: no hard limit enforced (D1 row count is fine).

### best_volume Calculation

`best_volume = MAX over all sets in a session of (reps * weight)` — **not** the sum. Specifically: for each session containing a given lift, compute `max(reps * weight)` across that lift's sets. The session with the highest such value wins. Update `lift_stats` in a D1 transaction whenever a workout containing that lift is created or updated.

> Rationale: caching avoids a multi-table aggregation query on every home page load as workout history grows.

---

## Feature Specifications

### Routines Page (`/routines`)

- Shows all 7 days of the week
- Each day shows the routine name (if configured) or "No routine" with a create button
- Click a day to go to `/routines/:day` (0–6)
- On `/routines/:day`: full routine editor
  - Add/remove/reorder lifts (htmx drag-and-drop or up/down buttons — keep it simple)
  - Set lift name (free text), rep range (min–max), set count
  - Group lifts into a superset (select adjacent lifts → "Make superset" button)
  - Remove a lift from a superset ("Remove from superset" button)

### Home / Workout Page (`/`)

- Determines today's weekday, loads the user's routine for that day
- If a `daily_override` exists for today, use it instead of the base routine
- Shows each lift (or superset group) with:
  - Lift name, rep range, set count
  - Most recent performance: date + sets (from `lift_stats.recent_*`)
  - Best performance: date + sets (from `lift_stats.best_*`)
- Reorder / swap / add / remove lifts for today only → auto-saves to `daily_overrides` via htmx PATCH
- Pop lift out of / push lift into a superset → same auto-save mechanism
- **"Complete Workout" button** at bottom:
  - Marks `daily_overrides.completed = 1`
  - If `inline_logging` is enabled: also submits the workout form (see below)
  - Fires the configured `webhook_url` via `ctx.waitUntil(fetch(...))` — non-blocking

### Inline Logging (toggleable feature)

- Controlled by `user_settings.inline_logging`
- When enabled, each lift on the home page shows N set input rows (reps + weight), where N = set count from the routine
- Inputs start blank (no pre-fill)
- On "Complete Workout", the form data is submitted as a new workout for today's date
- If a workout for today already exists, it is replaced (upsert by user_id + date)
- When disabled, the home page is read-only (no inputs shown)

### Workout Entry Page (`/workouts/new`)

- Standalone form for logging a completed workout
- Supports arbitrary lifts + sets + supersets (not tied to a routine)
- Date picker (defaults to today)
- Submit creates a workout via the same internal service used by the API

### Public Workout API (`/api/workouts`)

Authentication: accepts **either** a session JWT (`Authorization: Bearer <jwt>`) **or** an API key (`Authorization: ApiKey <key>`). The API key middleware hashes the incoming key with SHA-256 and looks up `api_keys.key_hash`.

Endpoints:
- `GET    /api/workouts`         — list workouts for authenticated user (paginated)
- `GET    /api/workouts/:id`     — get single workout with lifts + sets
- `POST   /api/workouts`         — create workout
- `PUT    /api/workouts/:id`     — replace workout (full update)
- `DELETE /api/workouts/:id`     — delete workout

Request/response bodies are JSON. Keep this API free of HTML/htmx concerns — it is the single source of truth used by both the frontend and external callers.

Workout JSON shape:
```json
{
  "date": "2026-03-04",
  "notes": "optional",
  "lifts": [
    {
      "lift_name": "Squat",
      "superset_id": null,
      "position": 0,
      "sets": [
        { "set_number": 1, "reps": 5, "weight": 225 }
      ]
    }
  ]
}
```

### Settings Page (`/settings`)

- Toggle inline logging on/off (htmx POST to update `user_settings`)
- Webhook URL field: single URL, POSTed to after workout completion with workout JSON as body
- API key management: list named keys, create new (shown once), revoke

### Webhook Behavior

After "Complete Workout":
1. Worker saves the workout (if inline logging enabled)
2. If `webhook_url` is set, fire `ctx.waitUntil(fetch(webhook_url, { method: 'POST', body: workoutJson }))` — non-blocking, best-effort
3. No retry logic for MVP — if the external function needs reliability, it can poll the API

---

## Auth

Keep the existing JWT + KV session architecture. Add:
- `api_keys` table (see schema above)
- `src/middleware/apiKey.ts` — middleware that checks `Authorization: ApiKey <key>` header
- Both the existing JWT middleware and the new API key middleware should set `c.set('userId', ...)` so route handlers are auth-agnostic

---

## PWA Considerations

- Existing `sw.js` and `manifest.json` are in `public/` — enhance them
- Cache the home page and static assets for offline use
- The home page should render a useful offline fallback (show cached routine from last visit)
- Use `display: standalone` in manifest, `theme_color` matching app palette
- Add `apple-touch-icon` and iOS meta tags for add-to-home-screen

---

## Code Conventions

- Follow existing patterns in `src/routes/` and `src/templates/`
- Routes: one file per domain area (`routines.ts`, `workouts.ts`, `home.ts`, `settings.ts`, `api/workouts.ts`)
- Templates: `src/templates/pages/` for full pages, `src/templates/partials/` for htmx fragments
- htmx fragments: detect `HX-Request` header and return only the inner partial, not the full layout
- Migrations: add new `.sql` files to `migrations/` — never edit existing ones
- After any `wrangler.jsonc` binding change: run `npx wrangler types` to regenerate `worker-configuration.d.ts`
- D1 queries: use prepared statements with `.bind()` — never string-interpolate user input into SQL
- Secrets: `JWT_SECRET` via `wrangler secret put` — never in `wrangler.jsonc`

---

## MVP Scope

**In scope:**
- Full routine CRUD with supersets
- Home page with daily routine display, per-day overrides, historical lift stats
- Inline logging toggle + workout submission from home page
- Dedicated workout entry page
- Public workout API with API key auth
- Single webhook URL setting
- Settings page

**Explicitly out of scope for MVP:**
- Lift library / autocomplete (lift names are free text)
- Historical workout browsing / analytics pages
- Multiple API keys per user (one is fine for MVP... or keep the table flexible for later)
- Weight unit preferences (pick one: lbs, document it)

**Design for future:**
- Lift name will eventually become a foreign key to a `lifts` table — use `lift_name TEXT` now but don't make it hard to migrate
- Historical analytics page will query `workouts` + `workout_sets` — keep indexes on `(user_id, date)`
