import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: {
    projectId: string;
  };
};

async function ProjectIDLayout({ children, params }: Props) {
  const res = await prisma.project.findUnique({
    where: { id: params.projectId },
  });

  console.log(res);

  if (!res) {
    return redirect("/dashboard");
  }

  return <>{children}</>;
}

export default ProjectIDLayout;
