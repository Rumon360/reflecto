"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteSchema } from "./schema";

export async function deleteReview(data: z.infer<typeof deleteSchema>) {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  const result = deleteSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.message };
  }

  const { id } = result.data;

  try {
    const review = await prisma.review.delete({
      where: {
        id: id,
        project: { members: { some: { userId: session.user.id } } },
      },
    });

    revalidatePath(`/dashboard/project/${review.projectId}`);
    revalidatePath(`/dashboard/project/${review.projectId}/reviews`);

    return { success: true };
  } catch (error) {
    console.log("Error deleting review", error);
    return { error: "Error deleting review" };
  }
}
