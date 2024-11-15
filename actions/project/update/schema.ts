import * as z from "zod";

export const updateProjectSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  title: z
    .string({
      invalid_type_error: "Title must be a string",
    })
    .min(1, "Title is required")
    .optional(),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .min(1, "Description is required")
    .optional(),
  url: z
    .string({
      invalid_type_error: "URL must be a string",
    })
    .min(1, "URL is required")
    .optional(),
});
