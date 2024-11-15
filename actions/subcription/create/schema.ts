import { z } from "zod";

export const subscriptionCreateSchema = z.object({
  plan: z.enum(["monthly", "yearly"]),
});
