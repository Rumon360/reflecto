import * as z from "zod";

export const createProjectSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(1, "Title is required"),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .min(1, "Description is required")
    .optional(),
  url: z
    .string({
      invalid_type_error: "URL must be a string",
      required_error: "URL is required",
    })
    .min(1, "URL is required"),
});
