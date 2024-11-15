import React from "react";
import Logo from "@/components/logo";
function Footer() {
  return (
    <footer className="flex w-full justify-between h-16 items-center">
      <Logo className="text-2xl" />
      <p className="text-center text-sm text-muted-foreground">
        Copyright &copy; 2024. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
