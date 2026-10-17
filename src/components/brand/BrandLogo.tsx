import Link from "next/link";

interface BrandLogoProps {
  variant?: "dark" | "light"; // dark = for light backgrounds; light = for dark backgrounds
  showTagline?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandLogo({
  variant = "dark",
  showTagline = false,
  className = "",
  size = "md",
}: BrandLogoProps) {
  const isLight = variant === "light";

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl md:text-4xl",
  };

  const iconSizes = {
    sm: { width: 28, height: 28 },
    md: { width: 36, height: 36 },
    lg: { width: 48, height: 48 },
  };

  const primaryColor = isLight ? "#FFFFFF" : "#102D50";
  const textColor = isLight ? "text-white" : "text-[#102D50]";
  const subTextColor = isLight ? "text-slate-300" : "text-slate-500";

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group transition-opacity hover:opacity-95 ${className}`}>
      {/* Brand Icon: Architectural geometric 'A' & house apex */}
      <svg
        width={iconSizes[size].width}
        height={iconSizes[size].height}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        {/* Background shield/foundation */}
        <rect width="48" height="48" rx="8" fill={isLight ? "rgba(255,255,255,0.12)" : "#102D50"} />
        
        {/* Main Architectural Apex (Roof/A structure) */}
        <path
          d="M24 10L10 24H16V36H32V24H38L24 10Z"
          fill="none"
          stroke={isLight ? "#FFFFFF" : "#FFFFFF"}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        
        {/* Stylized 'A' crossbar and apex core in Brand Red */}
        <path
          d="M24 14L17 26H31L24 14Z"
          fill="#D71935"
        />
        
        {/* Inner doorway signifying home / value */}
        <path
          d="M21 36V28H27V36"
          stroke={isLight ? "#102D50" : "#FFFFFF"}
          strokeWidth="2.5"
          fill={isLight ? "#FFFFFF" : "#102D50"}
        />
      </svg>

      <div className="flex flex-col">
        <div className="flex items-baseline tracking-tight">
          <span className={`font-serif font-black ${sizeClasses[size]} ${textColor} tracking-wider`}>
            ARTH
          </span>
          <span className="font-sans font-bold text-xs uppercase tracking-[0.25em] text-[#D71935] ml-2">
            PROPERTIES
          </span>
        </div>
        {showTagline && (
          <span className={`text-[10px] tracking-wider uppercase font-medium ${subTextColor} -mt-0.5`}>
            The Value Behind Every Home
          </span>
        )}
      </div>
    </Link>
  );
}
