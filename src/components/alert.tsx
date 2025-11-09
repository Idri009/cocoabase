"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

type AlertProps = {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  onClose?: () => void;
  className?: string;
  dismissible?: boolean;
};

export default function Alert({
  children,
  variant = "info",
  title,
  onClose,
  className,
  dismissible = false,
}: AlertProps) {
  const variantClasses = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  const iconMap = {
    info: "ℹ️",
    success: "✓",
    warning: "⚠️",
    error: "✕",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "rounded-lg border p-4",
        variantClasses[variant],
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">{iconMap[variant]}</span>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  );
}

