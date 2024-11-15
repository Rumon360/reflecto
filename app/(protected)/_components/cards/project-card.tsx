import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project, Role } from "@prisma/client";
import Link from "next/link";

type ProjectCardProps = {
  project: Project & {
    members: {
      role: Role;
    }[];
  };
};

function ProjectCard({ project }: ProjectCardProps) {
  const userRole = project.members[0].role;

  return (
    <Card className="relative h-fit group overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{project.title}</CardTitle>
          <Badge variant={userRole === "ADMIN" ? "default" : "secondary"}>
            {userRole}
          </Badge>
        </div>
        <CardDescription className="pt-2 line-clamp-3 break-words">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={`/dashboard/project/${project.id}`} passHref>
          <Button>View Project</Button>
        </Link>
      </CardFooter>
      <div className="hidden dark:block absolute pointer-events-none group-hover:rotate-2 transition ease-in-out duration-300 w-full aspect-square bg-primary left-0 right-0 top-[98%] blur-xl rounded-full" />
    </Card>
  );
}

export default ProjectCard;
