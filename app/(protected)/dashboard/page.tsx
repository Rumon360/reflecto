import React from "react";
import ProjectCard from "../_components/cards/project-card";
import UpgradeCard from "../_components/cards/upgrade-card";
import { getProjects } from "@/actions/project/get";
import { redirect } from "next/navigation";

async function DashboardPage() {
  const { data, error } = await getProjects();

  if (error) {
    return redirect("/login");
  }

  return (
    <main className="h-full w-full relative">
      <h2 className="pt-4 text-2xl font-semibold tracking-tight first:mt-0">
        My Projects
      </h2>
      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data?.length === 0
          ? null
          : data?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        <UpgradeCard />
      </div>
    </main>
  );
}

export default DashboardPage;
