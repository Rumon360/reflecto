import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { reviewFormSchema } from "@/actions/review/create/schema";
import { ratelimit } from "@/lib/redis";
import { Role, SubscriptionPlan } from "@prisma/client";
import { subscriptionPlansData } from "@/lib/data";
import { DiscordClient } from "@/lib/discord";

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    const body = await request.json();
    const result = reviewFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    const { token, name, image, email, content, rating } = result.data;

    const project = await prisma.project.findUnique({
      where: { token },
      select: { id: true, url: true, members: true, title: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const adminOfProject = project.members.find(
      (member) => member.role === Role.ADMIN
    );

    const adminProfile = await prisma.subscription.findUnique({
      where: { userId: adminOfProject?.userId },
      include: { user: { select: { discordId: true } } },
    });

    const subscriptionOfAdmin = adminProfile?.plan;

    if (subscriptionOfAdmin === SubscriptionPlan.FREE) {
      const reviews = await prisma.review.count({
        where: { projectId: project.id },
      });

      if (reviews >= subscriptionPlansData.reviewLimit) {
        return NextResponse.json(
          { error: "Review limit exceeded for free plan" },
          { status: 403 }
        );
      }
    }

    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      project.url,
    ].filter((url): url is string => Boolean(url));

    if (
      !allowedOrigins.some(
        (url) => origin === url || (referer && referer.startsWith(url))
      )
    ) {
      return NextResponse.json(
        { error: "Unauthorized origin" },
        { status: 403 }
      );
    }

    const ip = request.ip ?? "unknown";

    const identifier = ip;
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    await prisma.review.create({
      data: {
        projectId: project.id,
        name,
        email,
        rating: rating ? parseInt(rating) : undefined,
        description: content,
        image: image,
      },
    });

    if (adminProfile?.user.discordId) {
      try {
        const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN);
        const dmChannel = await discord.createDM(adminProfile.user.discordId);

        const stars = "⭐".repeat(parseInt(rating || "0"));
        const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/project/${project.id}/reviews`;

        await discord.sendEmbed(dmChannel.id, {
          title: "🎉 New Review Received!",
          description: `You've received a new review for **${project.title}**`,
          fields: [
            {
              name: "Reviewer",
              value: name ?? "unknown",
              inline: true,
            },
            {
              name: "Rating",
              value: rating ? `${stars}` : "No rating provided",
              inline: true,
            },
            {
              name: "Feedback",
              value: content || "No feedback provided",
            },
          ],
          footer: {
            text: "Click the title to view all reviews",
          },
          url: reviewUrl,
          timestamp: new Date().toISOString(),
          color: 0x030712,
        });
      } catch (error) {
        console.log("DISCORD NOTIFICATION ERROR", error);
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Review creation error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
