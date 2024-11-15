import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReviewForm } from "@prisma/client";
import { Settings } from "lucide-react";
import React from "react";
import ReviewSettingsCard from "./review-settings";

type Props = {
  reviewCardSettings: ReviewForm;
  projectId: string;
  setReviewCardSettings: (review: ReviewForm) => void;
};

function MobileReviewSettings({
  reviewCardSettings,
  projectId,
  setReviewCardSettings,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <ReviewSettingsCard
          reviewCardSettings={reviewCardSettings}
          setReviewCardSettings={setReviewCardSettings}
          projectId={projectId}
        />
      </DialogContent>
    </Dialog>
  );
}

export default MobileReviewSettings;
