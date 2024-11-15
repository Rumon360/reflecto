import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/user-menu";
import MobileSidebar from "./sidebar/mobile-sidebar";
import ProjectSelector from "./sidebar/project-selector";
import CreateProjectWrapper from "./wrapper/create-project";
import { getProjects } from "@/actions/project/get";
import { redirect } from "next/navigation";

async function Navbar() {
  const { data, error } = await getProjects();

  if (error) {
    return redirect("/login");
  }

  return (
    <nav className="h-16 px-4 sticky top-0 z-50 border-b bg-background items-center grid lg:grid-cols-[300px_1fr]">
      <div className="w-full hidden lg:block pr-0 lg:pr-4">
        <ProjectSelector data={data || []} />
      </div>
      <div className="flex lg:pl-4 pl-0 h-full items-center lg:border-l justify-between">
        <Logo href="/dashboard" className="text-2xl" />
        <div className="flex items-center gap-2">
          <CreateProjectWrapper>
            <Button>
              <span>Create a project</span>
            </Button>
          </CreateProjectWrapper>
          <ModeToggle />
          <UserMenu />
          <MobileSidebar data={data || []} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
