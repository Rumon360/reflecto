"use server";

import { z } from "zod";
import { profileCompletionSchema } from "./schema";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { profileUpdateSchema } from "./update/schema";
import { SubscriptionPlan } from "@prisma/client";

export async function getProfile() {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        name: true,
        username: true,
        email: true,
        bio: true,
        isProfileCompleted: true,
      },
    });
    return { user };
  } catch (error) {
    return { error: "Internal server error" };
  }
}

export async function profileCompletion(
  data: z.infer<typeof profileCompletionSchema>
) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const result = profileCompletionSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.message };
  }

  const { username, bio } = result.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: { equals: username, mode: "insensitive" },
        NOT: { id: session.user.id },
      },
    });

    if (existingUser) {
      return {
        error: "Username is already taken. Please choose a different username.",
      };
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          username,
          bio,
          isProfileCompleted: true,
        },
      });
      await prisma.subscription.create({
        data: {
          userId: session.user.id,
          plan: SubscriptionPlan.FREE,
        },
      });
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Profile completion error:", error);
    return { error: "Internal server error" };
  }
}

export const updateProfile = async (
  data: z.infer<typeof profileUpdateSchema>
) => {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const result = profileUpdateSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.message };
  }

  const { name, username, bio } = result.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: { equals: username, mode: "insensitive" },
        NOT: { id: session.user.id },
      },
    });

    if (existingUser) {
      return {
        error: "Username is already taken. Please choose a different username.",
      };
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        username,
        bio,
      },
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Internal server error" };
  }
};

export async function getProfilePlan() {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        subscription: { select: { plan: true } },
      },
    });
    const plan = user?.subscription?.plan;

    return { data: plan };
  } catch (error) {
    console.log("ERROR_GETTING_PROFILE_PLAN", error);
    return { error: "Internal server error" };
  }
}
