import { cn } from "@/lib/utils";
import React from "react";

type MaxWidthWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

function MaxWidthWrapper({ children, className }: MaxWidthWrapperProps) {
  return (
    <div className={cn("max-w-screen-xl mx-auto w-full px-4", className)}>
      {children}
    </div>
  );
}

export default MaxWidthWrapper;
