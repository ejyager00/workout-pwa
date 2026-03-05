import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { csrfMiddleware } from "../middleware/csrf";
import { ensureCsrfCookie } from "../lib/csrf";
import { render } from "../lib/render";
import { hashApiKey } from "../middleware/apiKey";
import type { Env, User } from "../types";

interface UserSettings {
  user_id: string;
  inline_logging: number;
  webhook_url: string | null;
  updated_at: number;
}

interface ApiKeyRow {
  id: string;
  name: string;
  created_at: number;
  last_used: number | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getOrCreateSettings(
  db: D1Database,
  userId: string
): Promise<UserSettings> {
  const existing = await db
    .prepare("SELECT * FROM user_settings WHERE user_id = ?")
    .bind(userId)
    .first<UserSettings>();
  if (existing) return existing;

  const now = Math.floor(Date.now() / 1000);
  await db
    .prepare(
      "INSERT INTO user_settings (user_id, inline_logging, webhook_url, updated_at) VALUES (?, 0, NULL, ?)"
    )
    .bind(userId, now)
    .run();
  return { user_id: userId, inline_logging: 0, webhook_url: null, updated_at: now };
}

async function listApiKeys(db: D1Database, userId: string): Promise<ApiKeyRow[]> {
  const rows = await db
    .prepare(
      "SELECT id, name, created_at, last_used FROM api_keys WHERE user_id = ? ORDER BY created_at DESC"
    )
    .bind(userId)
    .all<ApiKeyRow>();
  return rows.results;
}

/** Generates a cryptographically random API key prefixed with `wk_`. */
function generateApiKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return (
    "wk_" +
    btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")
  );
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const settings = new Hono<{
  Bindings: Env;
  Variables: { userId: string; user: User };
}>();

settings.use("*", authMiddleware);

// ---------------------------------------------------------------------------
// GET /settings
// ---------------------------------------------------------------------------
settings.get("/", async (c) => {
  const userId = c.get("userId");
  const [userSettings, apiKeys] = await Promise.all([
    getOrCreateSettings(c.env.DB, userId),
    listApiKeys(c.env.DB, userId),
  ]);

  const csrfToken = ensureCsrfCookie(c);
  return c.html(
    render("pages/settings.njk", {
      title: "Settings",
      csrfToken,
      user: c.get("user"),
      userSettings,
      inlineLogging: userSettings.inline_logging === 1,
      apiKeys,
      newKey: null,
    })
  );
});

// ---------------------------------------------------------------------------
// POST /settings/logging — toggle inline logging (htmx)
// ---------------------------------------------------------------------------
settings.post("/logging", csrfMiddleware, async (c) => {
  const userId = c.get("userId");
  const body = await c.req.parseBody();
  const current = await getOrCreateSettings(c.env.DB, userId);
  const newValue = current.inline_logging === 1 ? 0 : 1;
  const now = Math.floor(Date.now() / 1000);

  await c.env.DB.prepare(
    "UPDATE user_settings SET inline_logging = ?, updated_at = ? WHERE user_id = ?"
  )
    .bind(newValue, now, userId)
    .run();

  const csrfToken = ensureCsrfCookie(c);
  return c.html(
    render("partials/settings/logging-toggle.njk", {
      inlineLogging: newValue === 1,
      csrfToken,
    })
  );
});

// ---------------------------------------------------------------------------
// POST /settings/webhook — update webhook URL
// ---------------------------------------------------------------------------
settings.post("/webhook", csrfMiddleware, async (c) => {
  const userId = c.get("userId");
  const body = await c.req.parseBody();
  const webhookUrl = ((body.webhook_url as string) ?? "").trim() || null;
  const now = Math.floor(Date.now() / 1000);

  await c.env.DB.prepare(
    "UPDATE user_settings SET webhook_url = ?, updated_at = ? WHERE user_id = ?"
  )
    .bind(webhookUrl, now, userId)
    .run();

  return c.redirect("/settings", 302);
});

// ---------------------------------------------------------------------------
// POST /settings/api-keys — create a new API key (htmx)
// ---------------------------------------------------------------------------
settings.post("/api-keys", csrfMiddleware, async (c) => {
  const userId = c.get("userId");
  const body = await c.req.parseBody();
  const name = ((body.name as string) ?? "").trim();

  if (!name) {
    return c.redirect("/settings", 302);
  }

  const plainKey = generateApiKey();
  const keyHash = await hashApiKey(plainKey);
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  await c.env.DB.prepare(
    "INSERT INTO api_keys (id, user_id, key_hash, name, created_at) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(id, userId, keyHash, name, now)
    .run();

  const apiKeys = await listApiKeys(c.env.DB, userId);
  const csrfToken = ensureCsrfCookie(c);
  return c.html(
    render("partials/settings/api-keys.njk", {
      apiKeys,
      csrfToken,
      newKey: plainKey,
    })
  );
});

// ---------------------------------------------------------------------------
// POST /settings/api-keys/:id/revoke — delete an API key (htmx)
// ---------------------------------------------------------------------------
settings.post("/api-keys/:id/revoke", csrfMiddleware, async (c) => {
  const userId = c.get("userId");
  const keyId = c.req.param("id");

  await c.env.DB.prepare(
    "DELETE FROM api_keys WHERE id = ? AND user_id = ?"
  )
    .bind(keyId, userId)
    .run();

  const apiKeys = await listApiKeys(c.env.DB, userId);
  const csrfToken = ensureCsrfCookie(c);
  return c.html(
    render("partials/settings/api-keys.njk", {
      apiKeys,
      csrfToken,
      newKey: null,
    })
  );
});

export default settings;
