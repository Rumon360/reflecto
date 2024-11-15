import { z } from "zod";

export const reviewFormSchema = z.object({
  email: z
    .string()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Invalid email",
    }),
  name: z.string().optional(),
  rating: z
    .string()
    .optional()
    .refine(
      (value) => !value || (parseInt(value) >= 1 && parseInt(value) <= 5),
      { message: "Rating must be between 1 and 5" }
    ),
  content: z
    .string()
    .max(1000, "Content must be less than 1000 characters")
    .optional(),
  image: z.string().optional(),
  token: z.string().min(1, "Token is required"),
});
