import { getProfile } from "@/actions/profile";
import ProfileForm from "./_components/profile-form";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

async function ProfilePage() {
  const profile = await getProfile();

  if (profile.error) {
    return redirect("/dashboard");
  }

  const user = profile.user as User;

  return (
    <div className="pt-10">
      <ProfileForm user={user} />
    </div>
  );
}

export default ProfilePage;
