import { getReviews } from "@/actions/review/get";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Reviews from "./_components/reviews";

type Props = {
  params: {
    projectId: string;
  };
};

async function ReviewPage({ params }: Props) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["reviews", params.projectId],
    queryFn: () => getReviews(params.projectId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Reviews projectId={params.projectId} />
    </HydrationBoundary>
  );
}

export default ReviewPage;
