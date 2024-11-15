import MaxWidthWrapper from "@/components/maxwidth-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import React from "react";
import { plans } from "@/lib/data";
import { auth } from "@/auth";
import Link from "next/link";

async function PricingSection() {
  const session = await auth();
  const isAuthenticated = !!session;

  return (
    <MaxWidthWrapper className="py-20">
      <div className="mx-auto text-center max-w-3xl space-y-4">
        <h2 className="font-bold text-3xl sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="text-muted-foreground text-lg">
          Choose the plan that&apos;s right for you
        </p>
      </div>

      <div className="mx-auto max-w-5xl pt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                ${plan.price}
                <span className="text-lg font-normal text-muted-foreground">
                  {plan.duration}
                </span>
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Unlimited projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Unlimited members</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Unlimited reviews</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" size="lg">
                {isAuthenticated ? (
                  <a href={plan.link} target="_blank" rel="noopener noreferrer">
                    Get Started
                  </a>
                ) : (
                  <Link href="/login">Login to Subscribe</Link>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </MaxWidthWrapper>
  );
}

export default PricingSection;
