import UpgradeCard from "../cards/upgrade-card";
import SidebarContent from "./content";

async function Sidebar() {
  return (
    <div className="sticky top-[4rem] w-full h-[calc(100vh-4rem)] border-b overflow-hidden border-r hidden lg:block">
      <div className="flex flex-col justify-between h-full w-full relative py-4">
        <SidebarContent />
        <div className="mr-4">
          <UpgradeCard />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
