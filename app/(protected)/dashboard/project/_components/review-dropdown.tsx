"use client";

import { deleteReview } from "@/actions/review/delete";
import { deleteSchema } from "@/actions/review/delete/schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAction } from "@/hooks/use-action";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

type Props = {
  id: string;
  setIsOpen: (isOpen: boolean) => void;
};

function ReviewDropdown({ id, setIsOpen }: Props) {
  const { execute, loading } = useAction(deleteReview, deleteSchema, {
    onSuccess: () => {
      toast.success("Review deleted successfully");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            disabled={loading}
            onClick={() => execute({ id })}
            className="w-full flex justify-center cursor-pointer"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ReviewDropdown;
