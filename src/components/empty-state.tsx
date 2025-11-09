"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
};

export default function EmptyState({
  icon = "📭",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-6xl mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-semibold text-cocoa-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-cocoa-600 max-w-md mb-6">{description}</p>
      )}
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="rounded-full bg-cocoa-900 px-6 py-2 text-sm font-semibold text-cream-50 shadow-lg transition hover:bg-cocoa-800 focus:outline-none focus:ring-2 focus:ring-cocoa-500 focus:ring-offset-2"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}

