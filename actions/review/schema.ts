import { z } from "zod";

export const reviewSchema = z.object({
  id: z.string().min(1, "Id is required"),
  title: z.string().min(1, "Title is required"),
  projectId: z.string().min(1, "Project id is required"),
  description: z.string().min(1, "Description is required"),
  email: z.boolean(),
  name: z.boolean(),
  rating: z.boolean(),
  content: z.boolean(),
  image: z.boolean(),
  active: z.boolean(),
  onSuccess: z.string().optional(),
});
