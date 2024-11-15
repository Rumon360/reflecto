import MaxWidthWrapper from "@/components/maxwidth-wrapper";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col h-full w-full min-h-screen">
      <MaxWidthWrapper>
        <Navbar />
      </MaxWidthWrapper>
      <div className="flex-1">{children}</div>
      <MaxWidthWrapper>
        <Footer />
      </MaxWidthWrapper>
    </main>
  );
}

export default HomeLayout;
