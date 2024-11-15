import { z } from "zod";

export const deleteMemberSchema = z.object({
  memberId: z.string({
    required_error: "Member ID is required",
    invalid_type_error: "Member ID is required",
  }),
  projectId: z.string({
    required_error: "Project ID is required",
    invalid_type_error: "Project ID is required",
  }),
});
