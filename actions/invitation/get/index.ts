import { prisma } from "@/lib/db";

export async function getInvitationData(token: string) {
  try {
    const data = await prisma.invitationToken.findUnique({
      where: { token: token },
      include: {
        project: { select: { title: true, id: true } },
      },
    });

    if (!data)
      return {
        error: "No Invitation found",
      };

    if (data.expiresAt < new Date())
      return {
        error: "Invitation expired",
      };

    return data;
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to fetch invitation data",
    };
  }
}
