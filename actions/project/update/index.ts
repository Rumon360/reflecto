"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateProjectSchema } from "./schema";

export async function updateProject(data: z.infer<typeof updateProjectSchema>) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const result = updateProjectSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.message,
    };
  }

  const { title, description, url, projectId } = result.data;

  try {
    await prisma.project.update({
      where: {
        id: projectId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      data: {
        title: title,
        description: description,
        url: url,
      },
    });
    revalidatePath(`/dashboard/project/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Project update error:", error);
    return { error: "Internal server error" };
  }
}
