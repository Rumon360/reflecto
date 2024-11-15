import { auth } from "@/auth";
import MaxWidthWrapper from "@/components/maxwidth-wrapper";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import React from "react";

async function Hero() {
  const session = await auth();
  const isAuthenticated = !!session;

  return (
    <MaxWidthWrapper className="py-20">
      <div className="max-w-2xl mx-auto scroll-m-20 space-y-6 flex flex-col items-center">
        <h1 className="text-center text-4xl font-extrabold tracking-tight md:text-5xl">
          Capture Real-Time Feedback with Reflecto
        </h1>
        <h2 className="text-xl md:text-2xl text-center font-semibold tracking-tight">
          Empower your brand with actionable insights by collecting feedback in
          the most intuitive way. Reflecto helps you connect, improve, and grow.
        </h2>
        <div>
          {isAuthenticated ? (
            <Button
              asChild
              size={"lg"}
              className="text-base md:text-lg font-semibold"
            >
              <Link href={"/dashboard"}>Go to Dashboard</Link>
            </Button>
          ) : (
            <Button
              asChild
              size={"lg"}
              className="text-base md:text-lg font-semibold"
            >
              <Link href={"/login"}>Try it for free</Link>
            </Button>
          )}
        </div>
        <div className="mt-6 text-center space-y-2">
          <p className="text-lg md:text-xl font-medium">
            Join <span className="font-extrabold">10,000+</span> happy users
          </p>
          <div className="flex flex-col justify-center items-center space-y-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <Star className="text-yellow-400 fill-current" key={index} />
              ))}
            </div>
            <p className="ml-2 text-lg md:text-xl font-medium">
              <span className="font-extrabold">5/5</span> Rating based on
              hundreds of reviews
            </p>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

export default Hero;
