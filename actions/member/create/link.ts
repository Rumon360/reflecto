"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role, SubscriptionPlan } from "@prisma/client";
import { z } from "zod";
import { generateInvitationLinkSchema } from "./schema";

export async function generateInvitationLink(
  data: z.infer<typeof generateInvitationLinkSchema>
) {
  try {
    const session = await auth();

    if (!session) {
      return { error: "Unauthorized" };
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!subscription) {
      return {
        error: "Something went wrong!",
      };
    }

    if (subscription?.plan === SubscriptionPlan.FREE) {
      return {
        error: `Upgrade to "PRO" to add members`,
      };
    }

    const result = generateInvitationLinkSchema.safeParse(data);

    if (!result.success) {
      return { error: result.error.message };
    }

    const { projectId } = result.data;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        members: { some: { userId: session.user.id, role: Role.ADMIN } },
      },
      include: {
        inviteToken: true,
      },
    });

    if (!project) {
      return { error: "Not Allowed" };
    }

    let invitationToken;
    if (project.inviteToken) {
      invitationToken = await prisma.invitationToken.update({
        where: {
          projectId: project.id,
        },
        data: {
          token: crypto.randomUUID(),
          expiresAt: new Date(Date.now() + 600000),
        },
      });
    } else {
      invitationToken = await prisma.invitationToken.create({
        data: {
          projectId,
          token: crypto.randomUUID(),
          expiresAt: new Date(Date.now() + 600000),
        },
      });
    }

    return {
      success: true,
      data: {
        token: invitationToken.token,
      },
    };
  } catch (error) {
    console.error("Error generating invitation link:", error);
    return { error: "Internal server error" };
  }
}
