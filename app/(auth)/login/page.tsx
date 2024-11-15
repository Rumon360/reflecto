import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Logo from "@/components/logo";
import LoginButton from "../_components/login-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function LoginPage() {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <Logo className="text-2xl border-b pb-2" />
      </CardHeader>
      <CardContent>
        <p className="text-start mb-4 text-muted-foreground">
          To proceed with the next steps, we kindly ask you to sign in using
          your Google account.
        </p>
        <LoginButton />
        <Button asChild variant={"link"} className="mt-2 px-0">
          <Link href="/">Go back</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default LoginPage;
