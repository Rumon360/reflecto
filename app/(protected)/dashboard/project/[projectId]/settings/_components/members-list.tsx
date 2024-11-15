"use client";

import { Member, User } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/use-action";
import { deleteMember } from "@/actions/member/delete";
import { deleteMemberSchema } from "@/actions/member/delete/schema";
import { toast } from "sonner";

type Props = {
  members?: (Member & { user: User })[];
};

function MembersList({ members }: Props) {
  const { execute, loading } = useAction(deleteMember, deleteMemberSchema, {
    onSuccess: () => {
      toast.success("Member removed successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const [search, setSearch] = useState("");
  const filteredMembers = members?.filter(
    (member) =>
      member.user.username?.toLowerCase().includes(search.toLowerCase()) ||
      false
  );

  const onClick = (member: Member) => {
    if (member.role !== "ADMIN") {
      execute({ memberId: member.id, projectId: member.projectId });
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by username"
        className="max-w-xs mx-1"
      />
      <Table>
        <TableCaption>A list of your members.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No members found
              </TableCell>
            </TableRow>
          ) : (
            filteredMembers?.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback>
                      {member.user.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.user.username}</span>
                </TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={"icon"} variant={"ghost"}>
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Button
                          variant="ghost"
                          size={"sm"}
                          className="w-full text-sm"
                          disabled={member.role === "ADMIN" || loading}
                          onClick={() => onClick(member)}
                        >
                          {loading ? (
                            <span className="flex items-center gap-1">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Remove
                            </span>
                          ) : (
                            "Remove"
                          )}
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default MembersList;
