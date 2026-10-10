import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RemindMeLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  auth?: boolean;
  className?: string;
}

const sizes = {
  sm: { width: 112, height: 36 },
  md: { width: 144, height: 46 },
  lg: { width: 176, height: 56 },
};

export function RemindMeLogo({
  href = "/",
  size = "md",
  auth = false,
  className,
}: RemindMeLogoProps) {
  const { width, height } = sizes[size];
  const image = (
    <span className={cn("surface-logo", auth && "surface-logo-auth", className)}>
      <Image
        src="/RemindMe_logo.png"
        alt="RemindMe"
        width={width}
        height={height}
        className="h-auto w-auto"
        priority={auth || size !== "sm"}
      />
    </span>
  );

  if (!href) return image;
  return (
    <Link href={href} className="inline-flex" aria-label="RemindMe home">
      {image}
    </Link>
  );
}
