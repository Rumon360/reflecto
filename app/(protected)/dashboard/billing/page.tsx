import { getProfilePlan } from "@/actions/profile";
import React from "react";
import UpgradeCard from "../../_components/cards/upgrade-card";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const stripeBillingPortal =
  "https://billing.stripe.com/p/login/test_6oE8xp89Bd6M98I5kk";

async function BillingPage() {
  const result = await getProfilePlan();
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  if (result.error) {
    return null;
  }

  if (result.data === "FREE") {
    return (
      <div className="mt-4">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          You&apos;re currently on the Free Plan
        </h2>
        <p className="text-muted-foreground mb-6">
          With the Free Plan, you have limited access to features and projects.
          Upgrade to unlock premium features and more projects!
        </p>
        <UpgradeCard />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold tracking-tight mb-4">
        Your Current Plan:
        <span className="ml-2 py-1 px-2 bg-primary">{result.data}</span>
      </h2>
      <p className="text-muted-foreground mb-6">
        You are on a premium plan. You can manage your subscription or upgrade
        further if needed.
      </p>
      <Button asChild>
        <Link
          href={stripeBillingPortal + "?prefilled_email=" + session.user.email}
          target="_blank"
          rel="noopener noreferrer"
        >
          Manage Subscription
        </Link>
      </Button>
    </div>
  );
}

export default BillingPage;
