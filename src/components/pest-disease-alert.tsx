"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  PestDiseaseRecord,
  needsImmediateAttention,
  getTreatmentRecommendations,
  calculateAffectedPercentage,
} from "@/lib/pest-disease-utils";

type PestDiseaseAlertProps = {
  record: PestDiseaseRecord;
  totalArea?: number;
  className?: string;
};

export default function PestDiseaseAlert({
  record,
  totalArea,
  className,
}: PestDiseaseAlertProps) {
  const isUrgent = needsImmediateAttention(record);
  const recommendations = getTreatmentRecommendations(record.type, record.severity);
  const affectedPercentage = totalArea
    ? calculateAffectedPercentage(record.affectedArea, totalArea)
    : null;

  const severityColors = {
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
        isUrgent && "ring-2 ring-red-500",
        severityColors[record.severity],
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-sm mb-1">{record.name}</h4>
          <div className="text-xs opacity-75">
            {record.type.charAt(0).toUpperCase() + record.type.slice(1)} •{" "}
            {record.severity.toUpperCase()}
          </div>
        </div>
        {isUrgent && (
          <span className="text-lg animate-pulse">⚠️</span>
        )}
      </div>

      <div className="text-xs mb-3 space-y-1">
        <div>
          Detected: {new Date(record.detectedDate).toLocaleDateString()}
        </div>
        <div>
          Affected Area: {record.affectedArea.toFixed(2)} ha
          {affectedPercentage && ` (${affectedPercentage.toFixed(1)}%)`}
        </div>
        <div>Status: {record.status}</div>
      </div>

      {record.treatment && (
        <div className="mb-3 p-2 bg-white/50 rounded text-xs">
          <div className="font-medium mb-1">Treatment:</div>
          <div>{record.treatment}</div>
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

