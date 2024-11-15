"use server";

import { z } from "zod";
import { deleteProjectSchema } from "./schema";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

export async function deleteProject(data: z.infer<typeof deleteProjectSchema>) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const result = deleteProjectSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.message };
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: result.data.projectId },
      select: { members: true },
    });

    if (!project) {
      return { error: "Project not found" };
    }

    const isAdmin = project.members.some(
      (member) =>
        member.userId === session.user.id && member.role === Role.ADMIN
    );

    if (!isAdmin) {
      return { error: "Only admin can delete a project" };
    }

    await prisma.project.delete({
      where: {
        id: result.data.projectId,
      },
    });
    return { success: true };
  } catch (error) {
    console.log("Error deleting project", error);
    return { error: "Failed to delete project" };
  }
}
