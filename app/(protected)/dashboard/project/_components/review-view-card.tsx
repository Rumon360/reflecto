import { Review } from "@prisma/client";
import React from "react";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { Mail, Star } from "lucide-react";
import ReviewDropdown from "./review-dropdown";

type ReviewViewCardProps = {
  review: Review;
  setIsOpen: (isOpen: boolean) => void;
};

function ReviewViewCard({ review, setIsOpen }: ReviewViewCardProps) {
  const formattedDate = review.createdAt
    ? format(new Date(review.createdAt), "MMMM d, yyyy h:mm a")
    : "";

  return (
    <Card className="border-none shadow-none">
      {(review.name || review.email) && (
        <CardHeader className="p-4 border-b bg-primary/10">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              {review.name && (
                <CardTitle className="text-base font-semibold">
                  {review.name}
                </CardTitle>
              )}
              {review.email && (
                <p className="flex items-center text-sm font-medium text-muted-foreground mt-1">
                  <Mail className="mr-1 size-4" />
                  <span>{review.email}</span>
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-4 space-y-4 w-full">
        {review.image && (
          <div className="relative w-full aspect-[9/4] overflow-hidden rounded-lg">
            <Image
              src={review.image}
              alt="Review Image"
              fill
              className="object-cover"
            />
          </div>
        )}
        {review.description && (
          <p className="text-muted-foreground text-sm break-words max-w-md">
            {review.description}
          </p>
        )}
        {review.rating && (
          <div className="flex items-center">
            {[...Array(review.rating)].map((_, index) => (
              <Star
                key={index}
                className="mr-1 size-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 flex w-full items-center justify-between text-sm bg-primary/10 border-t">
        {review.createdAt && <span>{formattedDate}</span>}
        <ReviewDropdown id={review.id} setIsOpen={setIsOpen} />
      </CardFooter>
    </Card>
  );
}

export default ReviewViewCard;
