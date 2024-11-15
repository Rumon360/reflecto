"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function getProjects() {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          where: {
            userId: session.user.id,
          },
          select: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: projects,
    };
  } catch (error) {
    console.log(error);

    return { error: "Failed to fetch projects" };
  }
}
