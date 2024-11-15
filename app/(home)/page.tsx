import Hero from "./_components/hero";
import PricingSection from "./_components/pricing";

export default function Home() {
  return (
    <main className="w-full h-full relative">
      <div
        style={{
          backgroundImage:
            "radial-gradient(120% 120% at 50% 0%, hsl(var(--background)) 50%, hsl(var(--primary)))",
        }}
        className="w-full relative"
      >
        <Hero />
      </div>
      <PricingSection />
    </main>
  );
}
