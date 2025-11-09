"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type ChipProps = {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md" | "lg";
  onRemove?: () => void;
  className?: string;
  removable?: boolean;
};

export default function Chip({
  children,
  variant = "default",
  size = "md",
  onRemove,
  className,
  removable = false,
}: ChipProps) {
  const variantClasses = {
    default: "bg-cream-100 text-cocoa-700",
    primary: "bg-cocoa-600 text-white",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    outline: "border-2 border-cocoa-300 text-cocoa-700 bg-transparent",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
      {(removable || onRemove) && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:opacity-70 transition-opacity"
          aria-label="Remove"
        >
          ✕
        </button>
      )}
    </motion.span>
  );
}

