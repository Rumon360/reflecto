"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function getProject(projectId: string) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          select: {
            role: true,
          },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        reviewForm: true,
      },
    });

    if (!project) {
      return { error: "Project not found" };
    }

    return {
      data: {
        ...project,
      },
    };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
}

export async function getProjectByToken(token: string) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        token,
        active: true,
        reviewForm: { active: true },
      },
      select: {
        reviewForm: true,
      },
    });

    if (!project) {
      return { error: "Project not found" };
    }

    return project;
  } catch (error) {
    console.log("getProjectByToken", error);
    return { error: "Internal Server Error" };
  }
}
