import { createMiddleware } from "hono/factory";
import { getCookie, setCookie } from "hono/cookie";
import { verifyJwt, signJwt } from "../lib/jwt";
import type { Env, User } from "../types";

const ACCESS_TOKEN_TTL = 15 * 60;

const cookieOpts = {
  httpOnly: true,
  secure: true,
  sameSite: "Lax" as const,
  path: "/",
};

/**
 * JWT auth middleware.
 * Reads the `access_token` httpOnly cookie, checks the KV denylist,
 * verifies the token, and sets `userId` and `user` in the context.
 *
 * If the access token is missing or expired, silently attempts to issue a
 * new one using the `refresh_token` cookie (7-day sliding window). This
 * prevents spurious logouts when the browser is idle for >15 minutes.
 *
 * On failure:
 * - API/JSON requests → 401 JSON response
 * - Browser requests (Accept: text/html) → redirect to /auth/login
 */
export const authMiddleware = createMiddleware<{
  Bindings: Env;
  Variables: { userId: string; user: User };
}>(async (c, next) => {
  const acceptsHtml = c.req.header("Accept")?.includes("text/html");

  const fail = () => {
    if (acceptsHtml) return c.redirect("/auth/login", 302);
    return c.json({ error: "Unauthorized", status: 401 }, 401);
  };

  // --- Try access token ---
  const token = getCookie(c, "access_token");
  if (token) {
    const denied = await c.env.SESSIONS.get(`denylist:${token}`);
    if (denied === null) {
      const payload = await verifyJwt(token, c.env.JWT_SECRET);
      if (
        payload &&
        typeof payload.sub === "string" &&
        typeof payload.username === "string"
      ) {
        c.set("userId", payload.sub);
        c.set("user", { id: payload.sub, username: payload.username });
        await next();
        return;
      }
    }
  }

  // --- Access token missing/expired: attempt silent refresh ---
  const refreshToken = getCookie(c, "refresh_token");
  if (refreshToken) {
    const storedUserId = await c.env.SESSIONS.get(`refresh:${refreshToken}`);
    if (storedUserId) {
      const user = await c.env.DB.prepare(
        "SELECT id, username FROM users WHERE id = ?"
      )
        .bind(storedUserId)
        .first<{ id: string; username: string }>();

      if (user) {
        const newToken = await signJwt(
          { sub: user.id, username: user.username },
          c.env.JWT_SECRET,
          ACCESS_TOKEN_TTL
        );
        setCookie(c, "access_token", newToken, {
          ...cookieOpts,
          maxAge: ACCESS_TOKEN_TTL,
        });
        c.set("userId", user.id);
        c.set("user", { id: user.id, username: user.username });
        await next();
        return;
      }
    }
  }

  return fail();
});
