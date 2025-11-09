"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { YieldOptimizationTip, prioritizeTips } from "@/lib/yield-optimizer";

type YieldOptimizerTipsProps = {
  tips: YieldOptimizationTip[];
  className?: string;
};

export default function YieldOptimizerTips({
  tips,
  className,
}: YieldOptimizerTipsProps) {
  const prioritizedTips = prioritizeTips(tips);

  const impactColors = {
    high: "bg-red-100 border-red-300 text-red-800",
    medium: "bg-yellow-100 border-yellow-300 text-yellow-800",
    low: "bg-blue-100 border-blue-300 text-blue-800",
  };

  const difficultyColors = {
    easy: "text-green-600",
    medium: "text-yellow-600",
    hard: "text-red-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl bg-white border border-cream-200 p-6", className)}
    >
      <h3 className="text-lg font-semibold text-cocoa-800 mb-4">
        Yield Optimization Tips
      </h3>

      <div className="space-y-4">
        {prioritizedTips.map((tip) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "rounded-lg border p-4",
              impactColors[tip.impact]
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                <div className="text-xs opacity-75 mb-2">{tip.category}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">+{tip.estimatedIncrease}%</div>
                <div className="text-xs opacity-75">Increase</div>
              </div>
            </div>

            <p className="text-xs mb-3 opacity-90">{tip.description}</p>

            <div className="mb-3">
              <div className="text-xs font-medium mb-1">Implementation Steps:</div>
              <ul className="text-xs space-y-1">
                {tip.implementation.map((step, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span>•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="opacity-75">Difficulty:</span>{" "}
                <span className={cn("font-medium capitalize", difficultyColors[tip.difficulty])}>
                  {tip.difficulty}
                </span>
              </div>
              <div>
                <span className="opacity-75">Timeframe:</span>{" "}
                <span className="font-medium">{tip.timeframe}</span>
              </div>
              {tip.cost && (
                <div>
                  <span className="opacity-75">Cost:</span>{" "}
                  <span className="font-medium">${tip.cost}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

