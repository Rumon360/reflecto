import { auth } from "@/auth";
import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/user-menu";
import Link from "next/link";
import React from "react";

async function Navbar() {
  const session = await auth();
  const isAuthenticated = !!session;

  return (
    <nav className="h-16 sticky top-0 flex items-center justify-between w-full">
      <Logo className="text-2xl" />
      <div className="flex items-center gap-2">
        <ModeToggle />
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <Button asChild>
            <Link href={"/login"}>Get Started</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
