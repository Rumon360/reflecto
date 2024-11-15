"use client";

import { generateApiKey } from "@/actions/profile/api-key";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAction } from "@/hooks/use-action";
import { Check, Copy, Loader2, Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type SecretGeneratorDialogProps = {
  apiKey: string | null | undefined;
};

function SecretGeneratorDialog({ apiKey }: SecretGeneratorDialogProps) {
  const [value, setValue] = useState(apiKey ?? "");
  const [isCopied, setIsCopied] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy ", err);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    const res = await generateApiKey();
    if (res.error) {
      toast.error(res.error);
    }
    if (res.success) {
      if (res.data) {
        setValue(res.data);
        toast.success("Api Key Generated!");
      }
    }
    setLoading(false);
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
          <DialogTitle>Generate API Key</DialogTitle>
          <DialogDescription>
            Generate a unique API key to access your project reviews. Use this
            key in the Authorization header of your API requests. The API key
            gives you secure access to fetch reviews for your projects through
            our REST API endpoints.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex w-full max-w-xl items-center space-x-2">
            <Input
              type="text"
              readOnly
              value={value}
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
          <Button disabled={loading} onClick={handleClick}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              "Generate Api key"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SecretGeneratorDialog;
