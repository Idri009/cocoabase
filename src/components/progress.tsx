"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type ProgressProps = {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error" | "info";
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
};

export default function Progress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  label,
  className,
  animated = true,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variantClasses = {
    default: "bg-cocoa-600",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showLabel) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-sm font-medium text-cocoa-700">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm text-cocoa-600">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-cream-200 rounded-full overflow-hidden",
          sizeClasses[size]
        )}
      >
        <motion.div
          className={cn("rounded-full", variantClasses[variant])}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.5, ease: "easeOut" } : {}}
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
}

