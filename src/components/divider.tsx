"use client";

import { cn } from "@/lib/cn";

type DividerProps = {
  label?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  variant?: "solid" | "dashed" | "dotted";
};

export default function Divider({
  label,
  orientation = "horizontal",
  variant = "solid",
  className,
}: DividerProps) {
  const variantClasses = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };

  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          "h-full w-px border-l border-cream-300",
          variantClasses[variant],
          className
        )}
        aria-orientation="vertical"
      />
    );
  }

  if (label) {
    return (
      <div className={cn("flex items-center gap-4 my-4", className)}>
        <div
          className={cn(
            "flex-1 border-t border-cream-300",
            variantClasses[variant]
          )}
        />
        <span className="text-sm text-cocoa-500 font-medium">{label}</span>
        <div
          className={cn(
            "flex-1 border-t border-cream-300",
            variantClasses[variant]
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-t border-cream-300 my-4",
        variantClasses[variant],
        className
      )}
      aria-orientation="horizontal"
    />
  );
}

