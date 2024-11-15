import { z } from "zod";

export const deleteProjectSchema = z.object({
  projectId: z.string(),
});
