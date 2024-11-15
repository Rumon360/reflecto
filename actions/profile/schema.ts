import { z } from "zod";

export const profileCompletionSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username must only contain letters, numbers, and underscores.",
    }),
  bio: z
    .string()
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    })
    .min(1, {
      message: "Bio is required.",
    }),
});

export const addDiscordIdSchema = z.object({
  discordId: z.string({
    required_error: "Discord Id is required",
    invalid_type_error: "Discord Id is required",
  }),
});
