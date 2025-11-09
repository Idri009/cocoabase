"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  QualityAssessment,
  getQualityGradeColor,
  getQualityGradeLabel,
} from "@/lib/quality-utils";

type QualityIndicatorProps = {
  assessment: QualityAssessment;
  className?: string;
  showScore?: boolean;
};

export default function QualityIndicator({
  assessment,
  className,
  showScore = true,
}: QualityIndicatorProps) {
  const gradeColor = getQualityGradeColor(assessment.grade);
  const gradeLabel = getQualityGradeLabel(assessment.grade);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("flex items-center gap-2", className)}
    >
      <div
        className={cn(
          "px-3 py-1 rounded-lg text-sm font-semibold",
          gradeColor
        )}
      >
        {gradeLabel}
      </div>
      {showScore && (
        <div className="text-sm text-cocoa-600">
          Score: {assessment.score.toFixed(1)}/100
        </div>
      )}
    </motion.div>
  );
}

