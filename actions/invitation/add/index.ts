"use server";

import { z } from "zod";
import { addMemberSchema } from "./schema";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Role, SubscriptionPlan } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { DiscordClient } from "@/lib/discord";

export async function addMember(data: z.infer<typeof addMemberSchema>) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const res = addMemberSchema.safeParse(data);

  if (!res.success) {
    return { error: res.error.message };
  }

  const { token, projectId } = res.data;

  try {
    const invitation = await prisma.invitationToken.findUnique({
      where: { token, projectId },
      include: {
        project: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, discordId: true },
                },
              },
            },
          },
        },
      },
    });

    if (!invitation) {
      return { error: "Invitation not found" };
    }

    if (invitation.expiresAt < new Date()) {
      return { error: "Invitation has expired" };
    }

    const adminOfProject = invitation.project.members.find(
      (member) => member.role === Role.ADMIN
    );

    if (!adminOfProject) {
      return { error: "Project admin not found" };
    }

    const adminSubscription = await prisma.subscription.findUnique({
      where: { userId: adminOfProject.userId },
    });

    if (adminSubscription?.plan === SubscriptionPlan.FREE) {
      return { error: "The owner of the project has a free plan" };
    }

    if (
      invitation.project.members.some(
        (member) => member.user.id === session.user.id
      )
    ) {
      return { error: "User is already a member of this project" };
    }

    await prisma.member.create({
      data: {
        projectId,
        userId: session.user.id,
        role: Role.MEMBER,
      },
    });

    const adminDiscordId = adminOfProject.user.discordId;
    if (adminDiscordId) {
      try {
        const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN);
        const dmChannel = await discord.createDM(adminDiscordId);

        await discord.sendEmbed(dmChannel.id, {
          title: "🎉 New Member Joined!",
          description: `A new member has joined your project **${invitation.project.title}**`,
          fields: [
            {
              name: "Member Email",
              value: session.user.email ?? "unknown",
            },
          ],
          timestamp: new Date().toISOString(),
          color: 0x030712,
        });
      } catch (error) {
        console.error("DISCORD NOTIFICATION ERROR", error);
      }
    }

    revalidatePath(`/dashboard/project/${projectId}/settings`);

    return { success: true };
  } catch (error) {
    console.error("Error adding member", error);
    return {
      error: "Internal service error",
    };
  }
}
