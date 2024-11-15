"use client";

import { addMember } from "@/actions/invitation/add";
import { addMemberSchema } from "@/actions/invitation/add/schema";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type JoinButtonProps = {
  token: string;
  projectId: string;
};

function JoinButton({ token, projectId }: JoinButtonProps) {
  const router = useRouter();
  const { execute, loading } = useAction(addMember, addMemberSchema, {
    onSuccess: () => {
      toast.success("You have joined the project");
      router.push(`dashboard/project/${projectId}`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = () => {
    execute({ token, projectId });
  };

  return (
    <Button disabled={loading} onClick={onClick}>
      {loading ? (
        <span className="flex items-center gap-1">
          <Loader2 className="w-4 h-4 animate-spin" /> Join now
        </span>
      ) : (
        "Join now"
      )}
    </Button>
  );
}

export default JoinButton;
