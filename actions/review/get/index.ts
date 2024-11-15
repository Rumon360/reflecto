"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function getReviews(
  projectId: string,
  query?: string,
  page: number = 1,
  perPage: number = 8
) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const whereClause = {
      projectId,
      project: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      OR: [
        { name: { contains: query || "" } },
        { email: { contains: query || "" } },
        { rating: { equals: parseInt(query || "0") } },
      ],
    };

    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.review.count({
        where: whereClause,
      }),
    ]);

    const hasNextPage = totalReviews > page * perPage;
    const totalPages = Math.ceil(totalReviews / perPage);

    return { reviews, hasNextPage, totalPages };
  } catch (error) {
    console.log(error);

    return { error: "Failed to fetch reviews" };
  }
}
