import { cn } from "@/lib/utils";
import { Pirata_One } from "next/font/google";
import Link from "next/link";

const pirataOne = Pirata_One({
  subsets: ["latin"],
  weight: ["400"],
});

function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link href={href} className={cn(pirataOne.className, className)}>
      <span>Reflecto</span>
    </Link>
  );
}

export default Logo;
