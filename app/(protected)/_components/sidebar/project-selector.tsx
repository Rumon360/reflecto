"use client";

import { ChevronsUpDown, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandEmpty,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CommandGroup } from "@/components/ui/command";
import { CommandList } from "@/components/ui/command";
import { Command } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Project, Role } from "@prisma/client";
import { useRouter, useParams } from "next/navigation";

type ProjectSelectorProps = {
  data: (Project & {
    members: {
      role: Role;
    }[];
  })[];
};

function ProjectSelector({ data }: ProjectSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();
  const params = useParams();

  function handleSelect(id: string) {
    setValue(id);
    setOpen(false);
    router.push(`/dashboard/project/${id}`);
  }

  useEffect(() => {
    if (params.projectId) {
      setValue(params.projectId as string);
    } else {
      setValue("");
    }
  }, [params.projectId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between items-center"
        >
          {value
            ? data.find((project) => project.id === value)?.title
            : "Select Project..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full min-w-[280px]">
          <CommandInput placeholder="Search Project..." />
          <CommandList>
            <CommandEmpty>No Projects found.</CommandEmpty>
            <CommandGroup>
              {data?.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.title}
                  onSelect={() => {
                    handleSelect(project.id);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {project.members[0].role === "ADMIN" ? (
                      <Shield className="mr-2 text-primary h-4 w-4" />
                    ) : (
                      <User className="mr-2 text-primary h-4 w-4" />
                    )}
                    <span>{project.title}</span>
                  </div>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === project.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ProjectSelector;
