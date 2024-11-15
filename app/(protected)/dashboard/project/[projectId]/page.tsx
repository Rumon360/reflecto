import { getProject } from "@/actions/project/get/single";
import { redirect } from "next/navigation";
import React from "react";
import { Badge } from "@/components/ui/badge";
import LinkCopy from "../_components/link-copy";
import { Separator } from "@/components/ui/separator";
import ProjectStat from "../_components/stat";
import ProjectSettings from "../_components/settings";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import ReviewViewWrapper from "../_components/review-view-wrapper";

type ProjectPageProps = {
  params: {
    projectId: string;
  };
};

async function ProjectPage({ params }: ProjectPageProps) {
  const res = await getProject(params.projectId);

  if (res.error || !res.data) {
    return redirect("/dashboard");
  }

  const project = res.data;
  const reviews = project.reviews;

  return (
    <div className="h-full w-full relative pt-4 px-4">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold tracking-tight first:mt-0">
            {project.title}
          </h1>
          <div className="flex items-center gap-1">
            <Badge className="text-xs">{project.members[0].role}</Badge>
            <ProjectSettings project={project} />
          </div>
        </div>
        <Separator />
        <p className="mt-4 text-base text-muted-foreground break-words">
          {project.description}
        </p>
      </div>
      <div className="grid items-start grid-cols-1 md:grid-cols-2 gap-4 pt-6 mb-4">
        <LinkCopy token={project.token} />
        <ProjectStat reviews={reviews} />
      </div>
      <div>
        <div className="">
          <h2 className="text-xl font-semibold">Latest Reviews</h2>
        </div>
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="col-span-1">
                <CardContent className="py-2 px-4 flex items-center w-full justify-between">
                  <span className="text-sm font-semibold">
                    You have a new review
                  </span>
                  <ReviewViewWrapper review={review}>
                    <Button variant={"secondary"} size={"sm"}>
                      View
                    </Button>
                  </ReviewViewWrapper>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <p className="text-sm text-muted-foreground py-4 text-center">
                No reviews
              </p>
            </div>
          )}
        </div>
        {reviews.length > 0 && (
          <div className="flex w-full justify-center items-center py-4">
            <Button asChild variant={"link"}>
              <Link href={`/dashboard/project/${project.id}/reviews`}>
                View all reviews &rarr;
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectPage;
