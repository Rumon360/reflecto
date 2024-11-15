"use client";
import { signOut } from "next-auth/react";

function SignOutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <button onClick={() => signOut({ redirectTo: "/login" })}>
      {children}
    </button>
  );
}

export default SignOutWrapper;
