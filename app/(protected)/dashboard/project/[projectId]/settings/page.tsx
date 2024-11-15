import { getProject } from "@/actions/project/get/single";
import { redirect } from "next/navigation";
import Reviews from "../../_components/reviews";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AddMember from "./_components/add-member";
import MembersList from "./_components/members-list";
import { getMembers } from "@/actions/member/get";
import DangerZone from "./_components/danger-zone";

type ProjectSettingsPageProps = {
  params: {
    projectId: string;
  };
};

async function ProjectSettingsPage({ params }: ProjectSettingsPageProps) {
  const [res, members] = await Promise.all([
    getProject(params.projectId),
    getMembers(params.projectId),
  ]);

  if (res.error || !res.data) {
    return redirect("/dashboard");
  }

  const project = res.data;

  return (
    <div className="pt-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/project/${project.id}`}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {project.reviewForm && (
        <Reviews
          reviewForm={project.reviewForm}
          projectId={project.id}
          token={project.token}
        />
      )}
      {/* members */}
      <div className="pt-6">
        <div>
          <div className="flex w-full items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Members</h2>
            <AddMember />
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            View and manage your project members.
          </p>
        </div>
        <div>
          <MembersList members={members.data} />
        </div>
      </div>
      {/* Danger zone */}
      <DangerZone projectId={project.id} />
    </div>
  );
}

export default ProjectSettingsPage;
