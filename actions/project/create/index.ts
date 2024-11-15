"use server";

import { prisma } from "@/lib/db";

import { auth } from "@/auth";
import { createProjectSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Role, SubscriptionPlan } from "@prisma/client";
import { subscriptionPlansData } from "@/lib/data";

export async function createProject(data: z.infer<typeof createProjectSchema>) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const result = createProjectSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.message,
    };
  }

  const { title, description, url } = result.data;

  try {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        user: true,
      },
    });

    if (!subscription?.user.isProfileCompleted) {
      return { error: "You must complete your profile to create a project" };
    }

    if (subscription.plan === SubscriptionPlan.FREE) {
      const projects = await prisma.project.count({
        where: {
          members: { some: { userId: session.user.id } },
        },
      });

      if (projects >= subscriptionPlansData.limits) {
        return { error: "You have reached the maximum number of projects" };
      }
    }

    const createdProject = await prisma.project.create({
      data: {
        title,
        description,
        url,
        members: {
          create: {
            userId: session.user.id,
            role: Role.ADMIN,
          },
        },
      },
      include: {
        members: true,
      },
    });

    await prisma.reviewForm.create({
      data: { projectId: createdProject.id },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Project creation error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Internal server error" };
    }
  }
}
