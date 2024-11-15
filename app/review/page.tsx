import { getProjectByToken } from "@/actions/project/get/single";
import ReviewCard from "@/components/review-card";
import { ReviewForm } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";

type TProps = {
  searchParams: {
    token: string;
  };
};

type ProjectResponse =
  | {
      reviewForm: ReviewForm | null;
    }
  | {
      error: string;
    };

async function Review({ searchParams }: TProps) {
  const { token } = searchParams;
  const project: ProjectResponse = await getProjectByToken(token);

  if ("error" in project || !project.reviewForm) {
    return notFound();
  }

  const reviewForm = project.reviewForm;

  return (
    <main className="flex justify-center items-center w-full h-full min-h-screen">
      <ReviewCard
        title={reviewForm.title}
        description={reviewForm.description}
        email={reviewForm.email}
        name={reviewForm.name}
        rating={reviewForm.rating}
        content={reviewForm.content}
        image={reviewForm.image}
        token={token}
        isTest={false}
        onSuccess={reviewForm.onSuccess}
      />
    </main>
  );
}

export default Review;
