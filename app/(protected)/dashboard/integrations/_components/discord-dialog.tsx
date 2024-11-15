"use client";
import { addDiscordId } from "@/actions/profile/discord";
import { addDiscordIdSchema } from "@/actions/profile/schema";
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
import { Label } from "@/components/ui/label";
import { useAction } from "@/hooks/use-action";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type DiscordDialogProps = {
  discordId: string | null | undefined;
};

function DiscordDialog({ discordId }: DiscordDialogProps) {
  const [id, setId] = useState(discordId);
  const { execute, loading } = useAction(addDiscordId, addDiscordIdSchema, {
    onSuccess: () => {
      toast.success("Discord ID added!");
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleSubmit = () => {
    if (!id) return;
    const result = addDiscordIdSchema.safeParse({ discordId: id });
    if (!result.success) {
      toast.error("Invalid Discord ID");
      return;
    }
    execute({ discordId: result.data.discordId });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Discord</DialogTitle>
          <DialogDescription>
            Connect your Discord account to receive direct messages about your
            project updates and notifications.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center font-medium">
                <p>Step 1:</p>{" "}
                <Button variant="link" asChild>
                  <Link href={"https://discord.gg/MNxs7Rpn"}>
                    Join Discord Server
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Step 2: Enter your Discord ID</p>
              <p>
                After joining, we need your Discord ID to send you
                notifications.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discord-id" className="text-right">
                Discord ID
              </Label>
              <Input
                id="discord-id"
                placeholder="Enter your Discord ID"
                className="col-span-3"
                value={id ?? ""}
                onChange={handleChange}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p>To find your Discord ID:</p>
              <ol className="list-decimal ml-4 mt-2">
                <li>Open Discord Settings</li>
                <li>Go to App Settings → Advanced</li>
                <li>Enable Developer Mode</li>
                <li>Right-click your name and click &quot;Copy ID&quot;</li>
              </ol>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? (
              <p className="flex items-center">
                <Loader2 className="animate-spin mr-2" />
                <span>Loading...</span>
              </p>
            ) : (
              "Connect Discord"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DiscordDialog;
