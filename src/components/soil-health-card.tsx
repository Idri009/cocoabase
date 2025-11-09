"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  SoilTest,
  calculateSoilHealthScore,
  assessPHLevel,
  generateNutrientRecommendations,
  getSoilTypeCharacteristics,
} from "@/lib/soil-utils";

type SoilHealthCardProps = {
  test: SoilTest;
  className?: string;
};

export default function SoilHealthCard({
  test,
  className,
}: SoilHealthCardProps) {
  const healthScore = calculateSoilHealthScore(test);
  const phAssessment = assessPHLevel(test.ph);
  const recommendations = generateNutrientRecommendations(test);
  const characteristics = getSoilTypeCharacteristics(test.soilType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl bg-white border border-cream-200 p-6", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-cocoa-800">Soil Health</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-cocoa-800">{healthScore}/100</div>
          <div className="text-xs text-cocoa-500">Health Score</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-cocoa-700">pH Level</span>
            <span className="text-sm font-medium text-cocoa-800">{test.ph}</span>
          </div>
          <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(test.ph / 14) * 100}%` }}
              className={cn(
                "h-full",
                phAssessment.suitable ? "bg-green-500" : "bg-yellow-500"
              )}
            />
          </div>
          <div className="text-xs text-cocoa-500 mt-1">
            {phAssessment.level} {phAssessment.suitable ? "✓" : "⚠"}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-cocoa-700 mb-2">Nutrients</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Nitrogen</span>
              <span className="font-medium">{test.nitrogen} ppm</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Phosphorus</span>
              <span className="font-medium">{test.phosphorus} ppm</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Potassium</span>
              <span className="font-medium">{test.potassium} ppm</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Organic Matter</span>
              <span className="font-medium">{test.organicMatter}%</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-cocoa-700 mb-2">Soil Type</div>
          <div className="text-xs text-cocoa-600 capitalize">{test.soilType}</div>
          <div className="text-xs text-cocoa-500 mt-1">
            Drainage: {characteristics.drainage} • Fertility: {characteristics.fertility}
          </div>
        </div>

        {recommendations.some((r) => r.deficiency > 0) && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
            <div className="text-xs font-medium text-yellow-800 mb-2">
              Recommendations
            </div>
            <ul className="space-y-1">
              {recommendations
                .filter((r) => r.deficiency > 0)
                .map((rec, index) => (
                  <li key={index} className="text-xs text-yellow-700">
                    • {rec.recommendation}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

