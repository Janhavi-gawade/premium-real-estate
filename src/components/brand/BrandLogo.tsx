import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  variant?: "dark" | "light"; // dark = for light backgrounds; light = for dark backgrounds
  showTagline?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "stacked";
}

export default function BrandLogo({
  variant = "dark",
  showTagline = false,
  className = "",
  size = "md",
  layout = "horizontal",
}: BrandLogoProps) {
  const isLight = variant === "light";

  // Height sizing for the logo mark
  const heightClass = {
    sm: "h-9",
    md: "h-11 sm:h-12",
    lg: "h-16 sm:h-20",
  }[size];

  // Dynamic selection between horizontal and stacked logo variants
  const useStacked = layout === "stacked" || (size === "lg" && showTagline);

  const logoSrc = useStacked
    ? (isLight ? "/logo-white-text.png" : "/logo-transparent.png")
    : (isLight ? "/logo-horizontal-white.png" : "/logo-horizontal.png");

  return (
    <Link
      href="/"
      className={`inline-flex items-center group transition-all duration-300 hover:opacity-95 ${className}`}
      aria-label="Arth Properties — The Value Behind Every Home"
    >
      <div className={`relative ${heightClass} w-auto flex items-center`}>
        <Image
          src={logoSrc}
          alt="Arth Properties — The Value Behind Every Home"
          width={useStacked ? 220 : 280}
          height={useStacked ? 176 : 56}
          className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
          priority
        />
      </div>
    </Link>
  );
}
