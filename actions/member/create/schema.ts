import { z } from "zod";

export const generateInvitationLinkSchema = z.object({
  projectId: z.string({
    invalid_type_error: "Project ID is required",
    required_error: "Project ID is required",
  }),
});
