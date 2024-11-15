import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function getMembers(projectId: string) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const members = await prisma.member.findMany({
      where: {
        projectId,
      },
      include: {
        user: true,
      },
    });

    return { data: members };
  } catch (error) {
    console.log("Error fetching members", error);
    return { error: "Internal server error" };
  }
}
