"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addDiscordIdSchema } from "./schema";

export async function addDiscordId(data: z.infer<typeof addDiscordIdSchema>) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const result = addDiscordIdSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.message };
  }

  const { discordId } = result.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (!existingUser) {
      return {
        error: "User not found",
      };
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        discordId: discordId,
      },
    });

    revalidatePath("/dashboard/integrations");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Internal server error" };
  }
}

export async function getDiscordId() {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        id: session.user.id,
      },
      select: { discordId: true, apiKey: true },
    });

    if (!existingUser) {
      return {
        error: "User not found",
      };
    }

    return { discordId: existingUser.discordId, apiKey: existingUser.apiKey };
  } catch (error) {
    console.error("ERROR GETTING DISCORD_ID AND API_KEY", error);
    return { error: "Internal server error" };
  }
}
