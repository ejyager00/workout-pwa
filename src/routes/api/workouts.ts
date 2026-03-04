import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createMiddleware } from "hono/factory";
import { WorkoutInputSchema } from "../../schemas/workouts";
import { apiKeyMiddleware } from "../../middleware/apiKey";
import { verifyJwt } from "../../lib/jwt";
import {
  createWorkout,
  replaceWorkout,
  deleteWorkout,
  getWorkout,
  listWorkouts,
} from "../../lib/workouts";
import type { Env, User } from "../../types";

type ApiCtx = { Bindings: Env; Variables: { userId: string; user: User } };

// ---------------------------------------------------------------------------
// Auth middleware for the public API.
// Accepts either:
//   Authorization: Bearer <access-token>   (session JWT, from header not cookie)
//   Authorization: ApiKey <key>            (hashed API key)
// ---------------------------------------------------------------------------
const apiAuth = createMiddleware<ApiCtx>(async (c, next) => {
  const authHeader = c.req.header("Authorization") ?? "";

  if (authHeader.startsWith("ApiKey ")) {
    return apiKeyMiddleware(c, next);
  }

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();

    const denied = await c.env.SESSIONS.get(`denylist:${token}`);
    if (denied !== null) return c.json({ error: "Unauthorized" }, 401);

    const payload = await verifyJwt(token, c.env.JWT_SECRET);
    if (
      !payload ||
      typeof payload.sub !== "string" ||
      typeof payload.username !== "string"
    ) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("userId", payload.sub);
    c.set("user", { id: payload.sub, username: payload.username });
    return next();
  }

  return c.json({ error: "Unauthorized" }, 401);
});

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const api = new Hono<ApiCtx>();

api.use("*", apiAuth);

// GET /api/workouts
api.get("/", zValidator("query", paginationSchema), async (c) => {
  const { page, limit } = c.req.valid("query");
  const result = await listWorkouts(c.env.DB, c.get("userId"), page, limit);
  return c.json(result);
});

// GET /api/workouts/:id
api.get("/:id", async (c) => {
  const workout = await getWorkout(c.env.DB, c.get("userId"), c.req.param("id"));
  if (!workout) return c.json({ error: "Not found" }, 404);
  return c.json(workout);
});

// POST /api/workouts
api.post(
  "/",
  zValidator("json", WorkoutInputSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid input", issues: result.error.issues }, 400);
    }
  }),
  async (c) => {
    const data = c.req.valid("json");
    const id = await createWorkout(c.env.DB, c.get("userId"), data);
    const workout = await getWorkout(c.env.DB, c.get("userId"), id);
    return c.json(workout, 201);
  }
);

// PUT /api/workouts/:id
api.put(
  "/:id",
  zValidator("json", WorkoutInputSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid input", issues: result.error.issues }, 400);
    }
  }),
  async (c) => {
    const data = c.req.valid("json");
    const ok = await replaceWorkout(c.env.DB, c.get("userId"), c.req.param("id"), data);
    if (!ok) return c.json({ error: "Not found" }, 404);
    const workout = await getWorkout(c.env.DB, c.get("userId"), c.req.param("id"));
    return c.json(workout);
  }
);

// DELETE /api/workouts/:id
api.delete("/:id", async (c) => {
  const ok = await deleteWorkout(c.env.DB, c.get("userId"), c.req.param("id"));
  if (!ok) return c.json({ error: "Not found" }, 404);
  return c.json({ deleted: true });
});

export default api;
