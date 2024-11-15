import { Card } from "@/components/ui/card";
import { Review } from "@prisma/client";
import { Star } from "lucide-react";

type Props = {
  reviews: Review[];
};

function ProjectStat({ reviews }: Props) {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        ).toFixed(1)
      : 0;
  const highestRating =
    totalReviews > 0 ? Math.max(...reviews.map((review) => review.rating)) : 0;
  const lowestRating =
    totalReviews > 0 ? Math.min(...reviews.map((review) => review.rating)) : 0;

  return (
    <Card className="w-full max-w-xl relative noise bg-muted/10 px-6 py-4 rounded-lg space-y-6 border shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
          <span className="ml-2 text-2xl font-bold">{averageRating} / 5</span>
        </div>
        <span className="text-sm text-gray-500">{totalReviews} Reviews</span>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4">
        <div className="flex justify-between bg-muted/40 border p-4 rounded-md shadow-sm">
          <span className="text-sm font-medium">Highest Rating:</span>
          <span className="text-lg font-semibold ">{highestRating}</span>
        </div>
        <div className="flex justify-between bg-muted/40 border p-4  rounded-md shadow-sm">
          <span className="text-sm font-medium">Lowest Rating:</span>
          <span className="text-lg font-semibold ">{lowestRating}</span>
        </div>
      </div>
    </Card>
  );
}

export default ProjectStat;
