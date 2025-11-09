"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  CostEntry,
  calculateTotalCosts,
  getCostBreakdown,
  formatCostCategory,
} from "@/lib/cost-utils";

type CostBreakdownProps = {
  costs: CostEntry[];
  className?: string;
  showPercentage?: boolean;
};

export default function CostBreakdown({
  costs,
  className,
  showPercentage = true,
}: CostBreakdownProps) {
  const breakdown = getCostBreakdown(costs);
  const total = calculateTotalCosts(costs);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl bg-white border border-cream-200 p-6", className)}
    >
      <h3 className="text-lg font-semibold text-cocoa-800 mb-4">Cost Breakdown</h3>

      <div className="space-y-3">
        {breakdown.map((item) => (
          <div key={item.category} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-cocoa-700">
                {formatCostCategory(item.category)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-cocoa-800">
                  ${item.total.toLocaleString()}
                </span>
                {showPercentage && (
                  <span className="text-xs text-cocoa-500">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
            <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-full bg-cocoa-600 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-cream-200 flex items-center justify-between">
        <span className="font-semibold text-cocoa-800">Total</span>
        <span className="text-lg font-bold text-cocoa-800">
          ${total.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}

