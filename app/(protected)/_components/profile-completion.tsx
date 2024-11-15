import React from "react";
import ProfileCompletionForm from "./forms/profile-completion-form";

function ProfileCompletion() {
  return (
    <main
      style={{
        backgroundImage:
          "radial-gradient(110% 110% at 50% 0%, hsl(var(--background)) 50%, hsl(var(--primary)))",
      }}
      className="w-full h-full relative flex justify-center items-center"
    >
      <ProfileCompletionForm />
    </main>
  );
}

export default ProfileCompletion;
