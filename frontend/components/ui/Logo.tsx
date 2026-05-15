import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const iconPx = {
    sm: 32,
    md: 36,
    lg: 48
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-12 w-12"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className={`relative flex ${sizeClasses[size]} items-center justify-center rounded-xl overflow-hidden bg-surface-2 border border-border`}>
        <Image
          src="/brand/mnd-symbol.svg"
          alt="MnD"
          width={iconPx[size]}
          height={iconPx[size]}
          unoptimized
          className="object-contain"
        />
      </div>
      {showText && (
        <div className={`${textSizes[size]} uppercase tracking-[0.2em] font-semibold text-[hsl(var(--c-text))]`}>
          MnD Business Suite
        </div>
      )}
    </Link>
  );
}
