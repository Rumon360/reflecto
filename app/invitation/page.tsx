import { getInvitationData } from "@/actions/invitation/get";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InvitationToken } from "@prisma/client";
import { redirect } from "next/navigation";
import JoinButton from "./_components/join-button";

type InvitationPageProps = {
  searchParams: {
    token: string;
  };
};

type InvitationDataType = InvitationToken & {
  project: {
    title: string;
    id: string;
  };
  error?: string;
};

async function InvitationPage({ searchParams }: InvitationPageProps) {
  const token = searchParams.token;

  if (!token) return redirect("/");

  const res = (await getInvitationData(token)) as InvitationDataType;

  if (res.error) return redirect("/");

  return (
    <div className="flex justify-center items-center w-full h-full">
      <Card>
        <CardHeader>
          <CardTitle>You&apos;ve been invited to {res.project.title}</CardTitle>
          <CardDescription>
            This invitation will expire soon! Click &quot;Join Now&quot; to
            become a member.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <JoinButton token={token} projectId={res.project.id} />
        </CardFooter>
      </Card>
    </div>
  );
}

export default InvitationPage;
