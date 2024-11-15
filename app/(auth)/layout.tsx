import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        backgroundImage:
          "radial-gradient(110% 110% at 50% 0%, hsl(var(--background)) 50%, hsl(var(--primary)))",
      }}
      className="flex justify-center items-center h-screen"
    >
      {children}
    </main>
  );
}

export default AuthLayout;
