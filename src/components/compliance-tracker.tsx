"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  ComplianceRequirement,
  calculateComplianceRate,
  getDaysUntilDue,
  formatComplianceType,
} from "@/lib/compliance-utils";

type ComplianceTrackerProps = {
  requirements: ComplianceRequirement[];
  className?: string;
};

export default function ComplianceTracker({
  requirements,
  className,
}: ComplianceTrackerProps) {
  const complianceRate = calculateComplianceRate(requirements);
  const overdue = requirements.filter((r) => getDaysUntilDue(r) < 0 && r.status !== "compliant");
  const upcoming = requirements.filter(
    (r) => getDaysUntilDue(r) >= 0 && getDaysUntilDue(r) <= 30 && r.status !== "compliant"
  );

  const statusColors = {
    compliant: "bg-green-100 text-green-800 border-green-300",
    "non-compliant": "bg-red-100 text-red-800 border-red-300",
    "pending-review": "bg-yellow-100 text-yellow-800 border-yellow-300",
    expired: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl bg-white border border-cream-200 p-6", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-cocoa-800">Compliance Tracker</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-cocoa-800">
            {complianceRate.toFixed(1)}%
          </div>
          <div className="text-xs text-cocoa-500">Compliance Rate</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-cocoa-700">Overall Compliance</span>
          <span className="text-sm font-semibold text-cocoa-800">
            {complianceRate.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${complianceRate}%` }}
            transition={{ duration: 0.5 }}
            className={cn(
              "h-full rounded-full",
              complianceRate >= 90
                ? "bg-green-500"
                : complianceRate >= 70
                ? "bg-yellow-500"
                : "bg-red-500"
            )}
          />
        </div>
      </div>

      {(overdue.length > 0 || upcoming.length > 0) && (
        <div className="space-y-2 mb-4">
          {overdue.length > 0 && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <div className="text-sm font-medium text-red-800 mb-1">
                ⚠️ {overdue.length} Overdue Requirement{overdue.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
          {upcoming.length > 0 && (
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
              <div className="text-sm font-medium text-yellow-800 mb-1">
                📅 {upcoming.length} Upcoming Requirement{upcoming.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {requirements.slice(0, 5).map((requirement) => {
          const daysUntil = getDaysUntilDue(requirement);
          const isOverdue = daysUntil < 0;

          return (
            <div
              key={requirement.id}
              className={cn(
                "rounded-lg border p-3 text-sm",
                statusColors[requirement.status]
              )}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <div className="font-medium">{requirement.name}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {formatComplianceType(requirement.type)}
                  </div>
                </div>
                <div className="text-right text-xs">
                  {isOverdue ? (
                    <span className="text-red-600 font-medium">Overdue</span>
                  ) : (
                    <span>{daysUntil} days left</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
