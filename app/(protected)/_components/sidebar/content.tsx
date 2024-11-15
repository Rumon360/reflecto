"use client";

import { sidebarItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Blocks, Podcast, Settings } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type SidebarContentProps = {
  className?: string;
};

function SidebarContent({ className }: SidebarContentProps) {
  const params = useParams();

  return (
    <div
      className={cn("text-base h-full w-full relative font-medium", className)}
    >
      <ScrollArea>
        <div className="mb-4">
          {params.projectId && (
            <>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                Project
              </h3>
              <ul>
                {[
                  {
                    href: `/dashboard/project/${params.projectId}/settings`,
                    icon: Settings,
                    text: "Settings",
                  },
                  {
                    href: `/dashboard/project/${params.projectId}/reviews`,
                    icon: Podcast,
                    text: "Reviews",
                  },
                ].map((item, index) => (
                  <li key={index} className="group">
                    <Link
                      href={item.href}
                      className="flex text-sm items-center py-2 group-hover:text-primary transition-colors ease-in-out rounded-lg"
                    >
                      <item.icon className="mr-2 size-4" />
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {sidebarItems.map((sidebarItem) => (
          <div key={sidebarItem.id} className="mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2">
              {sidebarItem.title}
            </h3>
            <ul>
              {sidebarItem.items.map((item) => (
                <li key={item.id} className="group text-sm">
                  <Link
                    href={item.href}
                    className="flex items-center py-2 group-hover:text-primary transition-colors ease-in-out rounded-lg"
                  >
                    <item.icon className="mr-2 size-4 group-hover:text-primary transition-colors ease-in-out" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

export default SidebarContent;
