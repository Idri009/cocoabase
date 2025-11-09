"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  caption?: string;
  trendLabel?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon?: string;
  emphasis?: boolean;
};

type DashboardMetricsProps = {
  metrics: DashboardMetric[];
};

const trendColors: Record<
  NonNullable<DashboardMetric["trendDirection"]>,
  string
> = {
  up: "text-leaf-600",
  down: "text-rose-600",
  neutral: "text-cocoa-500",
};

const DashboardMetricsBase = ({ metrics }: DashboardMetricsProps) => {
  if (!metrics.length) {
    return null;
  }

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.article
          key={metric.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + index * 0.04 }}
          className={cn(
            "relative overflow-hidden rounded-3xl border border-cream-200 bg-white/85 p-4 shadow-sm shadow-cocoa-900/5 backdrop-blur",
            metric.emphasis && "border-leaf-200 bg-gradient-to-br from-leaf-100/60 to-cream-50"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.3em] text-cocoa-400">
                {metric.label}
              </span>
              <p
                className={cn(
                  "text-2xl font-semibold text-cocoa-900",
                  metric.emphasis && "text-cocoa-950"
                )}
              >
                {metric.value}
              </p>
              {metric.caption ? (
                <p className="text-xs text-cocoa-500">{metric.caption}</p>
              ) : null}
            </div>
            {metric.icon ? (
              <span className="text-2xl" role="img" aria-hidden>
                {metric.icon}
              </span>
            ) : null}
          </div>

          {metric.trendLabel ? (
            <p
              className={cn(
                "mt-3 flex items-center gap-1 text-xs font-medium",
                metric.trendDirection
                  ? trendColors[metric.trendDirection]
                  : "text-cocoa-500"
              )}
            >
              {metric.trendDirection === "up" && "▲"}
              {metric.trendDirection === "down" && "▼"}
              {metric.trendDirection === "neutral" && "◆"}
              <span>{metric.trendLabel}</span>
            </p>
          ) : null}

          {metric.emphasis ? (
            <motion.span
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-leaf-300/40 blur-2xl"
            />
          ) : null}
        </motion.article>
      ))}
    </section>
  );
};

const DashboardMetrics = memo(DashboardMetricsBase);

export type { DashboardMetric, DashboardMetricsProps };

export default DashboardMetrics;


