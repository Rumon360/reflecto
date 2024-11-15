import { z } from "zod";

export const addMemberSchema = z.object({
  token: z.string({
    required_error: "Invitation token is required",
    invalid_type_error: "Invitation token is required",
  }),
  projectId: z.string({
    required_error: "Project ID is required",
    invalid_type_error: "Project ID is required",
  }),
});
