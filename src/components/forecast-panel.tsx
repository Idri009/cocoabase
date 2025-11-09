"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import type { Plantation } from "@/store/plantations";
import {
  buildAnalyticsSnapshot,
  type AnalyticsSnapshot,
  type YieldForecast,
} from "@/lib/analytics";
import { cn } from "@/lib/cn";

type ForecastPanelProps = {
  plantations: Plantation[];
  snapshot?: AnalyticsSnapshot;
};

const confidenceStyles: Record<
  YieldForecast["confidence"],
  { badge: string; glow: string }
> = {
  high: {
    badge: "bg-leaf-200 text-leaf-900 border border-leaf-400",
    glow: "shadow-[0_0_35px_rgba(109,190,69,0.35)]",
  },
  medium: {
    badge: "bg-gold-100 text-gold-700 border border-gold-300",
    glow: "shadow-[0_0_30px_rgba(214,154,58,0.25)]",
  },
  low: {
    badge: "bg-amber-100 text-amber-700 border border-amber-300",
    glow: "shadow-[0_0_25px_rgba(244,201,95,0.2)]",
  },
};

function ForecastPanelBase({ plantations, snapshot }: ForecastPanelProps) {
  const analytics = useMemo(
    () => snapshot ?? buildAnalyticsSnapshot(plantations),
    [plantations, snapshot]
  );

  const forecasts = analytics.yieldForecasts.slice(0, 4);
  const cohorts = analytics.cohortPerformance.slice(-4);

  if (!forecasts.length && !cohorts.length) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cream-200 bg-cream-50/85 p-6 shadow-sm shadow-cocoa-900/5 backdrop-blur"
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-cocoa-900">
            Yield Forecast Radar
          </h2>
          <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
            Predictive harvest signals
          </p>
        </div>
        <span className="text-xs text-cocoa-500">
          Generated {format(new Date(analytics.lastUpdated), "MMM d, HH:mm")}
        </span>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-4">
          {forecasts.map((forecast) => (
            <motion.article
              key={forecast.id}
              layout
              className={cn(
                "rounded-3xl border border-cream-200 bg-white/85 p-5 shadow-sm transition",
                confidenceStyles[forecast.confidence]?.glow
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-cocoa-900">
                    {forecast.seedName}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.3em] text-cocoa-400">
                    {forecast.stage.toUpperCase()}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
                    confidenceStyles[forecast.confidence]?.badge
                  )}
                >
                  {forecast.confidence} confidence
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-cocoa-700">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-cocoa-400">
                    Projected yield
                  </p>
                  <p className="text-xl font-semibold text-cocoa-900">
                    {forecast.projectedYieldKg.toLocaleString()} kg
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-cocoa-400">
                    Projection window
                  </p>
                  <p className="text-sm font-medium text-cocoa-800">
                    {format(new Date(forecast.projectionDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex-1 min-w-[160px]">
                  <p className="text-xs uppercase tracking-[0.22em] text-cocoa-400">
                    Signal basis
                  </p>
                  <p className="text-sm text-cocoa-700">{forecast.basis}</p>
                </div>
              </div>
            </motion.article>
          ))}

          {forecasts.length === 0 && (
            <div className="rounded-3xl border border-dashed border-cream-300 bg-white/70 p-6 text-sm text-cocoa-500 shadow-inner">
              Log yield checkpoints to unlock predictive harvest insights.
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-3xl border border-cream-200 bg-white/80 p-5 shadow-inner shadow-cocoa-900/5">
          <header>
            <h3 className="text-sm font-semibold text-cocoa-900">
              Cohort Momentum
            </h3>
            <p className="text-xs text-cocoa-500">
              Recent planting cohorts and their harvest pace.
            </p>
          </header>

          <ul className="space-y-3">
            {cohorts.map((cohort) => (
              <li
                key={cohort.key}
                className="rounded-2xl border border-cream-200 bg-cream-50/80 px-4 py-3 text-sm text-cocoa-700"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cocoa-900">
                    {cohort.label}
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-cocoa-400">
                    {cohort.planted} planted
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-cocoa-500">
                  <span>
                    Harvest rate:{" "}
                    <span className="font-semibold text-cocoa-800">
                      {cohort.harvestRate}%
                    </span>
                  </span>
                  <span>
                    Avg cycle:{" "}
                    <span className="font-semibold text-cocoa-800">
                      {cohort.averageDaysToHarvest ?? "—"} days
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {cohorts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-cream-300 bg-white/60 p-4 text-xs text-cocoa-500">
              Plant new cohorts to start tracking harvest velocity.
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

const ForecastPanel = memo(ForecastPanelBase);

export default ForecastPanel;


