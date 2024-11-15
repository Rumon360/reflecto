import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { ratelimit } from "@/lib/redis";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // apply rate limiting
    const ip = req.ip ?? "unknown";
    const identifier = ip;
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Get API key from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }
    const apiKey = authHeader.split(" ")[1];

    // Verify API key
    const user = await prisma.user.findUnique({
      where: { apiKey },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized to access this project" },
        { status: 403 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const validatedQuery = querySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    const skip = (validatedQuery.page - 1) * validatedQuery.limit;

    // Get reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { projectId: params.projectId },
        skip,
        take: validatedQuery.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({
        where: { projectId: params.projectId },
      }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        total,
        pages: Math.ceil(total / validatedQuery.limit),
        page: validatedQuery.page,
        limit: validatedQuery.limit,
      },
    });
  } catch (error) {
    console.error("[REVIEWS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
