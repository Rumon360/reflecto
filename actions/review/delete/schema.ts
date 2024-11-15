import { z } from "zod";

export const deleteSchema = z.object({
  id: z.string({
    required_error: "Review ID is required",
    invalid_type_error: "Review ID must be a string",
  }),
});
