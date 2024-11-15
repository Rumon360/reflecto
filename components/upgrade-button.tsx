"use client";

import React, { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { plans } from "@/lib/data";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Props = {
  children: ReactNode;
};

function UpgradeCardButton({ children }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(
    plans[0].link
  );

  const { data: session } = useSession();

  const handleChange = (e: string) => {
    setSelectedPlan(e);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{children}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select your preferred subscription plan.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          defaultValue={selectedPlan}
          onValueChange={handleChange}
          className="flex flex-col gap-4"
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "flex cursor-pointer items-center space-x-2 bg-primary/10 rounded-lg p-4 shadow-md",
                {
                  "border-dotted border-2 border-primary":
                    selectedPlan === plan.link,
                }
              )}
            >
              <RadioGroupItem value={plan.link} id={plan.link} hidden />
              <Label htmlFor={plan.link} className="flex items-center gap-4">
                <div className="text-base font-bold text-foreground">
                  ${plan.price}
                  {plan.duration}
                </div>
                <div className="text-xs text-muted-foreground">
                  {plan.description}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div className="mt-4">
          <Button asChild>
            <Link
              href={selectedPlan + "?prefilled_email=" + session?.user?.email}
            >
              Subscribe
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpgradeCardButton;
