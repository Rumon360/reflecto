import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import SidebarContent from "./content";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ProjectSelector from "./project-selector";
import { Project, Role } from "@prisma/client";

type MobileSidebarProps = {
  data: (Project & {
    members: {
      role: Role;
    }[];
  })[];
};

function MobileSidebar({ data }: MobileSidebarProps) {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="pt-6">
            <ProjectSelector data={data || []} />
          </SheetHeader>
          <SidebarContent className="px-0" />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileSidebar;
