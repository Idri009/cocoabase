"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/cn";

type QuickAction = {
  id: string;
  label: string;
  icon: string;
  description: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

type QuickActionsProps = {
  actions: QuickAction[];
  className?: string;
  maxVisible?: number;
};

export default function QuickActions({
  actions,
  className,
  maxVisible = 4,
}: QuickActionsProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleActions = expanded ? actions : actions.slice(0, maxVisible);
  const hasMore = actions.length > maxVisible;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {visibleActions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2",
              action.variant === "primary"
                ? "bg-cocoa-900 text-cream-50 hover:bg-cocoa-800 focus:ring-cocoa-500"
                : action.variant === "danger"
                ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                : "border border-cream-300 bg-white text-cocoa-700 hover:border-cocoa-300 hover:text-cocoa-900 focus:ring-cocoa-200",
              action.disabled &&
                "cursor-not-allowed opacity-50 hover:scale-100"
            )}
            title={action.description}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </motion.button>
        ))}
        {hasMore && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2 text-sm font-semibold text-cocoa-700 shadow-sm transition hover:border-cocoa-300 hover:text-cocoa-900 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
          >
            <span>{expanded ? "▲" : "▼"}</span>
            <span>{expanded ? "Show less" : `+${actions.length - maxVisible} more`}</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}

