"use client";

import { motion } from "framer-motion";
import type { Plantation } from "@/store/plantations";
import { getPlantationInsights } from "@/lib/plantation-utils";
import { cn } from "@/lib/cn";

type PlantationInsightsProps = {
  plantation: Plantation;
  averageDaysToHarvest?: number | null;
  maxInsights?: number;
  className?: string;
};

export default function PlantationInsights({
  plantation,
  averageDaysToHarvest = null,
  maxInsights = 3,
  className,
}: PlantationInsightsProps) {
  const insights = getPlantationInsights(plantation, averageDaysToHarvest).slice(
    0,
    maxInsights
  );

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {insights.map((insight, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "rounded-lg px-3 py-2 text-xs",
            insight.type === "success"
              ? "bg-green-50/80 text-green-800 border border-green-200"
              : insight.type === "warning"
              ? "bg-amber-50/80 text-amber-800 border border-amber-200"
              : "bg-blue-50/80 text-blue-800 border border-blue-200"
          )}
        >
          <div className="flex items-start gap-2">
            <span className="text-sm">
              {insight.type === "success"
                ? "✓"
                : insight.type === "warning"
                ? "⚠"
                : "ℹ"}
            </span>
            <span className="flex-1">{insight.message}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

