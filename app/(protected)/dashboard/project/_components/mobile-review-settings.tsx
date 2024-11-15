import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReviewForm } from "@prisma/client";
import { Settings } from "lucide-react";
import React from "react";
import ReviewSettingsCard from "./review-settings";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Props = {
  reviewCardSettings: ReviewForm;
};

function MobileReviewSettings({ reviewCardSettings }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <ReviewSettingsCard reviewCardSettings={reviewCardSettings} />
      </DialogContent>
    </Dialog>
  );
}

export default MobileReviewSettings;
