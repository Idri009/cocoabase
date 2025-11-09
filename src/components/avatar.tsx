"use client";

import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/format-utils";

type AvatarProps = {
  name?: string;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: string;
};

export default function Avatar({
  name,
  src,
  alt,
  size = "md",
  className,
  fallback,
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const displayName = name || alt || "User";
  const initials = getInitials(displayName, 2);
  const imageSrc = src || fallback;

  return (
    <div
      className={cn(
        "rounded-full bg-cocoa-200 flex items-center justify-center font-semibold text-cocoa-700 overflow-hidden",
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label={alt || displayName}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt || displayName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.textContent = initials;
            }
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

