import { Hono } from "hono";
import { errorHandler } from "./middleware/error";
import authRoutes from "./routes/auth";
import indexRoutes from "./routes/index";
import routinesRoutes from "./routes/routines";
import workoutsRoutes from "./routes/workouts";
import apiWorkoutsRoutes from "./routes/api/workouts";
import settingsRoutes from "./routes/settings";
import aboutRoutes from "./routes/about";
import type { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

// Global error handler
app.onError(errorHandler);

// Route groups
app.route("/auth", authRoutes);
app.route("/routines", routinesRoutes);
app.route("/workouts", workoutsRoutes);
app.route("/api/workouts", apiWorkoutsRoutes);
app.route("/settings", settingsRoutes);
app.route("/about", aboutRoutes);
app.route("/", indexRoutes);

// Fall through to static assets for any unmatched routes
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
