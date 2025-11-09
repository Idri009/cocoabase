"use client";

import { cn } from "@/lib/cn";

type TagProps = {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Tag({
  children,
  variant = "default",
  size = "md",
  className,
}: TagProps) {
  const variantClasses = {
    default: "bg-cream-100 text-cocoa-700",
    primary: "bg-cocoa-600 text-white",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

