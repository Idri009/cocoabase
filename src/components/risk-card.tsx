"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  Risk,
  calculateRiskScore,
  generateMitigationRecommendations,
} from "@/lib/risk-utils";

type RiskCardProps = {
  risk: Risk;
  className?: string;
  showRecommendations?: boolean;
};

export default function RiskCard({
  risk,
  className,
  showRecommendations = true,
}: RiskCardProps) {
  const score = calculateRiskScore(risk.probability, risk.impact);
  const recommendations = showRecommendations
    ? generateMitigationRecommendations(risk)
    : [];

  const levelColors = {
    low: "bg-blue-100 border-blue-300 text-blue-800",
    medium: "bg-yellow-100 border-yellow-300 text-yellow-800",
    high: "bg-orange-100 border-orange-300 text-orange-800",
    critical: "bg-red-100 border-red-300 text-red-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-xl border p-4",
        levelColors[risk.level],
        risk.level === "critical" && "ring-2 ring-red-500",
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{risk.title}</h4>
          <div className="text-xs opacity-75 mb-2">{risk.category}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{score.toFixed(0)}</div>
          <div className="text-xs opacity-75">Risk Score</div>
        </div>
      </div>

      <p className="text-xs mb-3 opacity-90">{risk.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div>
          <span className="opacity-75">Probability:</span>{" "}
          <span className="font-medium">{risk.probability}%</span>
        </div>
        <div>
          <span className="opacity-75">Impact:</span>{" "}
          <span className="font-medium">{risk.impact}/100</span>
        </div>
        <div>
          <span className="opacity-75">Status:</span>{" "}
          <span className="font-medium capitalize">{risk.status}</span>
        </div>
        <div>
          <span className="opacity-75">Identified:</span>{" "}
          <span className="font-medium">
            {new Date(risk.identifiedDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {risk.mitigationPlan && (
        <div className="mb-3 p-2 bg-white/50 rounded text-xs">
          <div className="font-medium mb-1">Mitigation Plan:</div>
          <div>{risk.mitigationPlan}</div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <div className="text-xs font-medium mb-1">Recommendations:</div>
          <ul className="text-xs space-y-1">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-1">
                <span>•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

