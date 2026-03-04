import { z } from "zod";

export const WorkoutSetSchema = z.object({
  set_number: z.number().int().min(1),
  reps: z.number().int().min(0),
  weight: z.number().min(0),
});

export const WorkoutLiftSchema = z.object({
  lift_name: z.string().min(1).max(100),
  superset_id: z.string().nullable().default(null),
  position: z.number().int().min(0),
  sets: z.array(WorkoutSetSchema).min(1),
});

export const WorkoutInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  notes: z.string().max(2000).optional(),
  lifts: z.array(WorkoutLiftSchema).min(1, "At least one lift is required"),
});
