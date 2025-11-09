"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { copyToClipboard } from "@/lib/browser-utils";
import { cn } from "@/lib/cn";

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  variant?: "default" | "icon" | "minimal";
  size?: "sm" | "md" | "lg";
};

export default function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  className,
  variant = "default",
  size = "md",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  if (variant === "icon") {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCopy}
        className={cn(
          "rounded-full p-2 text-cocoa-600 hover:bg-cream-100 transition-colors",
          className
        )}
        aria-label={copied ? copiedLabel : label}
        title={copied ? copiedLabel : label}
      >
        {copied ? "✓" : "📋"}
      </motion.button>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCopy}
        className={cn(
          "text-cocoa-600 hover:text-cocoa-900 underline text-sm",
          className
        )}
      >
        {copied ? copiedLabel : label}
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCopy}
      className={cn(
        "rounded-full border border-cream-300 bg-white px-3 py-1.5 text-sm font-semibold text-cocoa-700 shadow-sm transition hover:border-cocoa-300 hover:text-cocoa-900 focus:outline-none focus:ring-2 focus:ring-cocoa-200",
        sizeClasses[size],
        copied && "bg-green-50 border-green-300 text-green-700",
        className
      )}
    >
      {copied ? copiedLabel : label}
    </motion.button>
  );
}

