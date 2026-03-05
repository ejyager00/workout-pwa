# Lift Log

A mobile-first progressive web app for strength training tracking. Log workouts, manage weekly routines, and review your best and most recent performance for every lift — all from the home screen.

Live at **lifts.yager.me**

## Stack

| Layer | Technology |
|---|---|
| Runtime | Cloudflare Worker (TypeScript) |
| Routing | [Hono](https://hono.dev) |
| Database | Cloudflare D1 (SQLite) |
| Sessions / Token storage | Cloudflare KV |
| Frontend | [HTMX](https://htmx.org) + [Tailwind CSS](https://tailwindcss.com) |
| Templating | [Nunjucks](https://mozilla.github.io/nunjucks/) (SSR, precompiled at build time) |
| Validation | [Zod](https://zod.dev) + [@hono/zod-validator](https://github.com/honojs/middleware/tree/main/packages/zod-validator) |
| Auth | Username/password (PBKDF2 via SubtleCrypto) + JWT in `httpOnly` cookie |
| Bot protection | [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| Testing | [Vitest](https://vitest.dev) + [@cloudflare/vitest-pool-workers](https://developers.cloudflare.com/workers/testing/vitest-integration/) |

## Features

**Routines** — Configure a workout routine for each day of the week. Each routine holds any number of lifts with a name, rep range, and set count. Lifts can be grouped into supersets.

**Home / Today's workout** — The home page loads today's routine and shows your last and best performance for every lift (cached in `lift_stats`). Reorder, add, or remove lifts for today without touching the base routine — changes are saved as a `daily_override`.

**Inline logging** — Toggle in Settings. When enabled, each lift on the home page shows set inputs (reps + weight). Submitting "Complete Workout" saves the session and fires the configured webhook.

**Workout entry** — A standalone form at `/workouts/new` for logging a session not tied to a routine. Supports arbitrary lifts, sets, and supersets.

**Public API** — `GET/POST/PUT/DELETE /api/workouts` accepts either a session JWT or an API key, so external tools (e.g. Garmin, Shortcuts) can push workouts directly.

**Settings** — Toggle inline logging, set a webhook URL (POSTed to after each completed workout), and manage API keys.

**PWA** — Installable, works offline. The home page is cached on each visit so you can see your routine without a connection. Static assets use cache-first; the service worker version is bumped on breaking changes.

## Project Structure

```
/
├── wrangler.jsonc                    # Cloudflare Workers config
├── migrations/
│   ├── 0001_initial.sql              # users table
│   ├── 0002_notes.sql
│   └── 0003_workout_schema.sql       # routines, workouts, lift_stats, api_keys, etc.
├── src/
│   ├── index.ts                      # Hono app entry point
│   ├── types.ts                      # Env interface
│   ├── schemas/
│   │   ├── auth.ts
│   │   ├── routines.ts
│   │   └── workouts.ts
│   ├── middleware/
│   │   ├── auth.ts                   # JWT verification
│   │   ├── apiKey.ts                 # API key verification
│   │   ├── csrf.ts
│   │   └── error.ts
│   ├── routes/
│   │   ├── index.ts                  # / — home, daily overrides, complete workout
│   │   ├── routines.ts               # /routines, /routines/:day
│   │   ├── workouts.ts               # /workouts/new
│   │   ├── settings.ts               # /settings
│   │   ├── auth.ts                   # /auth/*
│   │   └── api/
│   │       └── workouts.ts           # /api/workouts (JSON API)
│   ├── lib/
│   │   ├── workouts.ts               # createWorkout, replaceWorkout, updateLiftStats
│   │   ├── render.ts                 # Nunjucks SSR helper
│   │   ├── jwt.ts
│   │   ├── crypto.ts
│   │   ├── csrf.ts
│   │   └── turnstile.ts
│   ├── templates/
│   │   ├── base.njk
│   │   ├── partials/
│   │   │   ├── head.njk
│   │   │   ├── nav.njk
│   │   │   ├── bottom-nav.njk
│   │   │   ├── home/lifts-panel.njk
│   │   │   ├── routines/items-list.njk
│   │   │   └── settings/
│   │   └── pages/
│   │       ├── index.njk
│   │       ├── routines/
│   │       ├── workouts/new.njk
│   │       └── settings.njk
│   └── __tests__/
│       └── auth.test.ts
└── public/                           # Static assets (served by Worker Assets binding)
    ├── manifest.json
    ├── sw.js
    ├── offline.html
    └── icons/
```

## Setup

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- A Cloudflare account with Workers access
- Wrangler authenticated: `npx wrangler login`

### 1. Install dependencies

```bash
npm install
```

### 2. Create Cloudflare resources

Run the interactive setup wizard — it provisions D1 databases and KV namespaces and patches `wrangler.jsonc` automatically:

```bash
npm run setup
```

### 3. Configure local secrets

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars`:

```
JWT_SECRET=changeme_use_a_long_random_string
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
TURNSTILE_SITE_KEY=1x00000000000000000000AA
ENVIRONMENT=dev
```

The example Turnstile keys always pass — no real Turnstile account needed for local development.

### 4. Apply migrations

```bash
npm run db:migrate:dev
```

### 5. Start the dev server

```bash
npm run dev
```

Visit `http://localhost:8787`. You'll be redirected to `/auth/login`.

## Scripts

| Script | Command |
|---|---|
| `npm run dev` | Build (templates + CSS) and start local dev server with CSS watch |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npm run build` | Precompile Nunjucks templates + compile Tailwind CSS |
| `npm run precompile` | Precompile templates only (run after editing `.njk` files) |
| `npm run tailwind:build` | Compile Tailwind CSS only |
| `npm run types` | Regenerate TypeScript types from `wrangler.jsonc` |
| `npm test` | Run integration tests |
| `npm run db:migrate:dev` | Apply migrations to local D1 |
| `npm run db:migrate:prod` | Apply migrations to remote D1 |

## Deployment

```bash
# Set production secrets (first time only)
npx wrangler secret put JWT_SECRET --env production
npx wrangler secret put TURNSTILE_SECRET_KEY --env production

# Apply migrations to production DB
npm run db:migrate:prod

# Deploy
npm run deploy
```

## Development Notes

- **Templates**: Nunjucks templates are precompiled to plain JS at build time (`npm run precompile`). The Workers runtime blocks `new Function()`, so runtime compilation is not possible. Always run `npm run build` (or at minimum `npm run precompile`) after editing any `.njk` file.
- **Tailwind**: Source is `src/styles/app.css`; output is `public/app.css`. `npm run dev` runs the compiler in watch mode alongside wrangler.
- **D1 queries**: Always use prepared statements with `.bind()` — never interpolate user input into SQL strings.
- **Migrations**: Add new numbered `.sql` files to `migrations/` and never edit existing ones.
- **Bindings**: After any `wrangler.jsonc` binding change, run `npm run types` to regenerate `worker-configuration.d.ts`.
- **PWA cache**: When deploying breaking changes to static assets, increment `CACHE_VERSION` in `public/sw.js`. The activate event will purge the old cache automatically.
- **Weights**: stored in lbs throughout.
