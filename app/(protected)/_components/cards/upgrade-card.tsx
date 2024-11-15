import { getProfilePlan } from "@/actions/profile";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UpgradeCardButton from "@/components/upgrade-button";

async function UpgradeCard() {
  const result = await getProfilePlan();

  if (result.error) {
    return null;
  }

  if (result.data === "FREE") {
    return (
      <Card className="relative h-fit group overflow-hidden max-w-sm">
        <CardHeader>
          <CardTitle>Upgrade to Pro</CardTitle>
          <CardDescription className="pt-2">
            You are on the free plan with <span className="font-bold">3</span>{" "}
            projects. Upgrade now to get more projects and unlock premium
            features.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <UpgradeCardButton>Upgrade to Pro</UpgradeCardButton>
        </CardFooter>
        <div className="hidden dark:block absolute pointer-events-none group-hover:rotate-2 transition ease-in-out duration-300 w-full aspect-square bg-primary left-0 right-0 top-[98%] blur-xl rounded-full" />
      </Card>
    );
  }

  return (
    <Card className="relative h-fit group overflow-hidden">
      <CardHeader>
        <CardTitle>
          <Badge>Pro Plan Active</Badge>
        </CardTitle>
        <CardDescription className="pt-2">
          You are enjoying unlimited projects and premium features with your Pro
          plan subscription.
        </CardDescription>
      </CardHeader>
      <div className="hidden dark:block absolute pointer-events-none group-hover:rotate-2 transition ease-in-out duration-300 w-full aspect-square bg-primary left-0 right-0 top-[98%] blur-xl rounded-full" />
    </Card>
  );
}

export default UpgradeCard;
