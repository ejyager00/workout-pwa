import { z } from "zod";

export const RoutineNameSchema = z.object({
  name: z.string().max(100).default(""),
});

export const RoutineItemSchema = z.object({
  lift_name: z.string().min(1, "Lift name is required").max(100),
  reps_min: z.coerce.number().int().min(1).max(999),
  reps_max: z.coerce.number().int().min(1).max(999),
  sets: z.coerce.number().int().min(1).max(99),
});
