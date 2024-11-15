"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Check,
  Copy,
  Database,
  Loader2,
  Loader2Icon,
  Plus,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAction } from "@/hooks/use-action";
import { generateInvitationLink } from "@/actions/member/create/link";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { generateInvitationLinkSchema } from "@/actions/member/create/schema";

function AddMember() {
  const [value, setValue] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const params = useParams();

  const { execute, loading } = useAction(
    generateInvitationLink,
    generateInvitationLinkSchema,
    {
      onSuccess: (data) => {
        const url = `${window.location.origin}/invitation?token=${data.token}`;
        setValue(url);
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy ", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Invitation Link</DialogTitle>
          <DialogDescription>
            Create a unique link to invite new members to your project. This
            link will expire after 10 minutes. If it expires, you’ll need to
            generate a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex w-full max-w-xl items-center space-x-2">
            <Input
              type="text"
              readOnly
              value={value}
              disabled={loading}
              className="flex-grow text-base bg-muted/40"
              aria-label="Review link"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={handleCopy}
                    variant={"outline"}
                    aria-label={isCopied ? "Copied" : "Copy link"}
                    title="Copy link to clipboard"
                    disabled={loading}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCopied ? "Link has been copied" : "Copy link"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            onClick={() => execute({ projectId: params.projectId as string })}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              "Generate Link"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddMember;
