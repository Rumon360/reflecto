"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

function LinkCopy({ token }: { token: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/review?token=${token}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="w-full max-w-xl relative noise bg-muted/10 px-6 py-4 rounded-lg border shadow space-y-6">
      <div>
        <h2 className="text-lg pb-4 font-semibold text-muted-foreground">
          Share this link with your customers to collect feedback
        </h2>
        <Separator />
      </div>
      <div className="flex w-full max-w-xl items-center space-x-2">
        <Input
          type="text"
          value={link}
          readOnly
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
      <div className="text-sm text-muted-foreground">
        This link allows customers to submit reviews directly to your project.
        The more reviews you collect, the better insights you&apos;ll gain!
      </div>
    </div>
  );
}

export default LinkCopy;
