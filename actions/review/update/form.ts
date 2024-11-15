"use server";

import { z } from "zod";
import { reviewSchema } from "../schema";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateReviewSetting(data: z.infer<typeof reviewSchema>) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const result = reviewSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.message,
    };
  }

  const { id, projectId, ...rest } = result.data;

  try {
    await prisma.reviewForm.update({
      where: {
        id: result.data.id,
        projectId: result.data.projectId,
        project: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      data: rest,
    });

    revalidatePath(`/dashboard/project/${result.data.projectId}`);
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      error: "Internal server error",
    };
  }
}
