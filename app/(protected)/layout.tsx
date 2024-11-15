import { auth } from "@/auth";
import ProfileCompletion from "./_components/profile-completion";
import { getProfile } from "@/actions/profile";
import { redirect } from "next/navigation";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAuthenticated = !!session;
  if (!isAuthenticated) return redirect("/login");

  const profile = await getProfile();
  const isProfileCompleted = profile.user?.isProfileCompleted;
  if (!isProfileCompleted) return <ProfileCompletion />;

  return (
    <main className="w-full h-full relative">
      <Navbar />
      <div className="w-full min-h-[calc(100vh-4rem)] relative grid gap-4 px-4 lg:grid-cols-[300px_1fr]">
        <Sidebar />
        <div className="w-full h-full relative overflow-y-auto">{children}</div>
      </div>
    </main>
  );
}

export default DashboardLayout;
