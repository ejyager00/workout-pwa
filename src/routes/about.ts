import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { render } from "../lib/render";
import { verifyJwt } from "../lib/jwt";
import { ensureCsrfCookie } from "../lib/csrf";
import type { Env } from "../types";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  // Soft auth: populate user for the nav if logged in, but don't redirect if not.
  let user = null;
  const token = getCookie(c, "access_token");
  if (token) {
    const denied = await c.env.SESSIONS.get(`denylist:${token}`);
    if (!denied) {
      const payload = await verifyJwt(token, c.env.JWT_SECRET);
      if (
        payload &&
        typeof payload.sub === "string" &&
        typeof payload.username === "string"
      ) {
        user = { id: payload.sub, username: payload.username };
      }
    }
  }

  const csrfToken = user ? ensureCsrfCookie(c) : undefined;
  return c.html(render("pages/about.njk", { title: "About", user, csrfToken }));
});

export default app;
