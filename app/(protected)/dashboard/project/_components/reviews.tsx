"use client";

import { useState } from "react";
import { ReviewForm } from "@prisma/client";
import ReviewSettingsCard from "./review-settings";
import MobileReviewSettings from "./mobile-review-settings";
import ReviewCard from "@/components/review-card";

type ReviewsProps = {
  reviewForm: ReviewForm;
  projectId: string;
  token: string;
};

function Reviews({ reviewForm, projectId, token }: ReviewsProps) {
  const [reviewCardSettings, setReviewCardSettings] =
    useState<ReviewForm>(reviewForm);

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Review Form</h2>
        <div className="xl:hidden block">
          <MobileReviewSettings reviewCardSettings={reviewCardSettings} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Customize the review form below to gather feedback from your users.
      </p>
      <div className="flex gap-4 w-full items-start">
        <div className="hidden xl:block flex-1 border rounded-xl w-full">
          <ReviewSettingsCard
            reviewCardSettings={reviewCardSettings}
            setReviewCardSettings={setReviewCardSettings}
            projectId={projectId}
          />
        </div>
        <ReviewCard
          title={reviewCardSettings.title}
          description={reviewCardSettings.description}
          email={reviewCardSettings.email}
          name={reviewCardSettings.name}
          rating={reviewCardSettings.rating}
          content={reviewCardSettings.content}
          image={reviewCardSettings.image}
          onSuccess={reviewCardSettings.onSuccess}
          isTest={true}
          token={token}
        />
      </div>
    </div>
  );
}

export default Reviews;
