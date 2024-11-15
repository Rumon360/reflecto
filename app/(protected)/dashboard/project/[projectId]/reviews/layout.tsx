import QueryProvider from "@/components/provider/query-provider";

function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}

export default ReviewsLayout;
