"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  CarbonMetrics,
  calculateAllProjections,
  formatCarbonOffset,
  calculateCarbonSavings,
} from "@/lib/carbon-calculator";

type CarbonProjectionsProps = {
  metrics: CarbonMetrics;
  className?: string;
};

export default function CarbonProjections({
  metrics,
  className,
}: CarbonProjectionsProps) {
  const projections = calculateAllProjections(metrics);

  const periodLabels = {
    "30d": "30 Days",
    "90d": "90 Days",
    "1y": "1 Year",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl bg-white border border-cream-200 p-6", className)}
    >
      <h3 className="text-lg font-semibold text-cocoa-800 mb-4">Carbon Offset Projections</h3>

      <div className="space-y-4">
        {projections.map((projection) => {
          const savings = calculateCarbonSavings(
            projection.currentOffset,
            projection.projectedOffset
          );

          return (
            <div
              key={projection.period}
              className="rounded-lg border border-cream-200 p-4 bg-gradient-to-r from-green-50 to-blue-50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-cocoa-800">
                  {periodLabels[projection.period]}
                </span>
                <span className="text-sm text-green-600 font-semibold">
                  +{savings.percentage.toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-cocoa-500 mb-1">Current</div>
                  <div className="font-semibold text-cocoa-800">
                    {formatCarbonOffset(projection.currentOffset)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-cocoa-500 mb-1">Projected</div>
                  <div className="font-semibold text-green-600">
                    {formatCarbonOffset(projection.projectedOffset)}
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-cream-200">
                <div className="text-xs text-cocoa-600">
                  Potential increase:{" "}
                  <span className="font-semibold text-green-600">
                    +{formatCarbonOffset(projection.potentialIncrease)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

