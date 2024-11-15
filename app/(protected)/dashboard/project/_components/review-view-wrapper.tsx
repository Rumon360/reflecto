"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Review } from "@prisma/client";

import { ReactNode, useState } from "react";
import ReviewViewCard from "./review-view-card";

type Props = {
  children: ReactNode;
  review: Review;
};

function ReviewViewWrapper({ children, review }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 border-none rounded-lg overflow-hidden bg-primary/10">
        <ReviewViewCard review={review} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}

export default ReviewViewWrapper;
