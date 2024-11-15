"use client";

import { getReviews } from "@/actions/review/get";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Review } from "@prisma/client";
import { useDebounce } from "use-debounce";
import ReviewViewWrapper from "../../../_components/review-view-wrapper";
import { Button } from "@/components/ui/button";

type Props = {
  projectId: string;
};

function Reviews({ projectId }: Props) {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 400);

  const {
    data,
    isLoading,
    error,
  }: UseQueryResult<
    { reviews: Review[]; hasNextPage: boolean; totalPages: number },
    Error
  > = useQuery({
    queryKey: ["posts", projectId, page, debouncedQuery],
    queryFn: () => getReviews(projectId, debouncedQuery, page),
  });

  if (error) return <div>Error: {error.message}</div>;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="pt-6">
      <Breadcrumb className="mx-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/project/${projectId}`}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Reviews</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="pt-6">
        <Input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Search reviews..."
          className="max-w-sm mb-4 mx-1"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review</TableCell>
              <TableCell>Date</TableCell>
              <TableCell className="text-right">View</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center p-6">
                  Loading
                </TableCell>
              </TableRow>
            ) : data && data.reviews && data.reviews.length > 0 ? (
              data.reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.name || "N/A"}</TableCell>
                  <TableCell>{review.email || "N/A"}</TableCell>
                  <TableCell>{review.rating || "N/A"}</TableCell>
                  <TableCell className="overflow-hidden">
                    <span className="line-clamp-1 max-w-xs">
                      {review.description || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <ReviewViewWrapper review={review}>
                      <Button variant={"secondary"} size={"sm"}>
                        View
                      </Button>
                    </ReviewViewWrapper>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {!isLoading &&
        data?.totalPages &&
        data.totalPages > 0 &&
        data.reviews.length > 0 ? (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationPrevious
                onClick={() => {
                  if (page > 1) {
                    handlePageChange(page - 1);
                  }
                }}
              />
              {page > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
              )}
              {page > 2 && (
                <PaginationItem>
                  <PaginationLink>...</PaginationLink>
                </PaginationItem>
              )}
              {page > 1 && page < data.totalPages && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )}
              {page < data.totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink>...</PaginationLink>
                </PaginationItem>
              )}
              {page < data.totalPages && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(data.totalPages)}
                  >
                    {data.totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationNext
                onClick={() => {
                  if (data?.hasNextPage) {
                    handlePageChange(page + 1);
                  }
                }}
              />
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}

export default Reviews;
