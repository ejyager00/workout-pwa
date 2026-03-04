import { createMiddleware } from "hono/factory";
import type { Env, User } from "../types";

/**
 * SHA-256 hash of a plain-text API key.
 * Exported so the settings route can hash new keys before storing them.
 */
export async function hashApiKey(key: string): Promise<string> {
  const data = new TextEncoder().encode(key);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Middleware that checks the `Authorization: ApiKey <key>` header.
 * On success, sets `userId` and `user` in context variables.
 * On failure, returns 401 JSON.
 */
export const apiKeyMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: { userId: string; user: User };
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("ApiKey ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const key = authHeader.slice(7).trim();
  if (!key) return c.json({ error: "Unauthorized" }, 401);

  const keyHash = await hashApiKey(key);
  const row = await c.env.DB.prepare(
    `SELECT ak.user_id, u.username
     FROM api_keys ak
     JOIN users u ON u.id = ak.user_id
     WHERE ak.key_hash = ?`
  )
    .bind(keyHash)
    .first<{ user_id: string; username: string }>();

  if (!row) return c.json({ error: "Unauthorized" }, 401);

  // Update last_used timestamp (fire-and-forget is fine here)
  c.executionCtx.waitUntil(
    c.env.DB.prepare("UPDATE api_keys SET last_used = ? WHERE key_hash = ?")
      .bind(Math.floor(Date.now() / 1000), keyHash)
      .run()
  );

  c.set("userId", row.user_id);
  c.set("user", { id: row.user_id, username: row.username });
  await next();
});
