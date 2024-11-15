"use client";

import { deleteProject } from "@/actions/project/delete";
import { deleteProjectSchema } from "@/actions/project/delete/schema";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type Props = {
  projectId: string;
};

function DangerZone({ projectId }: Props) {
  const router = useRouter();
  const { execute, loading } = useAction(deleteProject, deleteProjectSchema, {
    onSuccess: () => {
      toast.success("Project deleted successfully");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  return (
    <div className="mt-6 p-6 bg-gradient-to-b from-destructive/50 to-transparent rounded-lg">
      <div>
        <h2 className="text-xl font-semibold">Danger zone</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Delete your project.
        </p>
      </div>
      <Button
        variant={"destructive"}
        onClick={() => execute({ projectId })}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-1">
            <Loader2 className="w-4 h-4 animate-spin" /> Delete now
          </span>
        ) : (
          "Delete now"
        )}
      </Button>
    </div>
  );
}

export default DangerZone;
