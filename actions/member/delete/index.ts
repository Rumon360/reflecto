"use server";

import { auth } from "@/auth";
import { deleteMemberSchema } from "./schema";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function deleteMember(input: z.infer<typeof deleteMemberSchema>) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const result = deleteMemberSchema.safeParse(input);

  if (!result.success) {
    return { error: result.error.message };
  }

  const { memberId, projectId } = result.data;

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        members: {
          some: {
            userId: session.user.id,
            role: Role.ADMIN,
          },
        },
      },
    });

    if (!project) {
      return { error: "Unauthorized" };
    }

    await prisma.member.delete({
      where: {
        id: memberId,
        projectId: projectId,
      },
    });

    revalidatePath(`/dashboard/project/${projectId}/settings`);
    return { success: true };
  } catch (error) {
    console.log("Error deleting member", error);
    return {
      error: "Internal server error",
    };
  }
}
