"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function generateApiKey() {
  try {
    const session = await auth();

    if (!session) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        apiKey: crypto.randomUUID(),
      },
    });

    if (!user) {
      return {
        error: "No user found",
      };
    }

    return {
      success: true,
      data: user.apiKey,
    };
  } catch (error) {
    console.error("Error generating invitation link:", error);
    return { error: "Internal server error" };
  }
}
