"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { usePlantationsStore } from "@/store/plantations";
import { useFinancialStore } from "@/store/financial";
import { useQualityControlStore } from "@/store/quality-control";
import { buildAnalyticsSnapshot } from "@/lib/analytics";
import AnimatedCounter from "./animated-counter";

export default function PerformanceBenchmark() {
  const plantations = usePlantationsStore((state) => state.plantations);
  const transactions = useFinancialStore((state) => state.transactions);
  const qualityTests = useQualityControlStore((state) => state.tests);

  const analyticsSnapshot = buildAnalyticsSnapshot(plantations);

  const benchmarks = useMemo(() => {
    const harvested = plantations.filter((p) => p.stage === "harvested");
    const totalRevenue = transactions
      .filter((t) => t.type === "revenue")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const avgYieldPerPlantation =
      harvested.length > 0
        ? harvested.reduce((sum, p) => {
            const latestCheckpoint = p.yieldTimeline
              ? [...p.yieldTimeline].sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )[0]
              : null;
            return sum + (latestCheckpoint?.yieldKg || 0);
          }, 0) / harvested.length
        : 0;

    const avgCarbonPerTree =
      analyticsSnapshot.sustainabilityTotals.treeCount > 0
        ? analyticsSnapshot.sustainabilityTotals.carbonOffsetTons /
          analyticsSnapshot.sustainabilityTotals.treeCount
        : 0;

    const avgQualityGrade = qualityTests.length > 0
      ? qualityTests.reduce((sum, t) => {
          const gradeValues: Record<string, number> = {
            premium: 4,
            grade_a: 3,
            grade_b: 2,
            reject: 1,
          };
          return sum + (gradeValues[t.grade] || 0);
        }, 0) / qualityTests.length
      : 0;

    const harvestRate =
      plantations.length > 0
        ? (harvested.length / plantations.length) * 100
        : 0;

    const profitMargin =
      totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;

    return {
      avgYieldPerPlantation,
      avgCarbonPerTree,
      avgQualityGrade,
      harvestRate,
      profitMargin,
      totalPlantations: plantations.length,
      totalHarvested: harvested.length,
    };
  }, [plantations, transactions, qualityTests, analyticsSnapshot]);

  const metrics = [
    {
      label: "Average yield per plantation",
      value: benchmarks.avgYieldPerPlantation,
      unit: "kg",
      color: "emerald",
    },
    {
      label: "Average carbon per tree",
      value: benchmarks.avgCarbonPerTree,
      unit: "tons",
      color: "blue",
    },
    {
      label: "Average quality grade",
      value: benchmarks.avgQualityGrade,
      unit: "/4.0",
      color: "purple",
    },
    {
      label: "Harvest rate",
      value: benchmarks.harvestRate,
      unit: "%",
      color: "amber",
    },
    {
      label: "Profit margin",
      value: benchmarks.profitMargin,
      unit: "%",
      color: benchmarks.profitMargin >= 0 ? "emerald" : "rose",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cocoa-800/60 bg-[#101f3c]/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur"
    >
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Performance benchmark
          </h2>
          <p className="text-sm text-slate-300/80">
            Key performance indicators and benchmarks for your operations.
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => {
          const colorClasses: Record<string, string> = {
            emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
            blue: "border-blue-500/40 bg-blue-500/10 text-blue-300",
            purple: "border-purple-500/40 bg-purple-500/10 text-purple-300",
            amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
            rose: "border-rose-500/40 bg-rose-500/10 text-rose-300",
          };

          return (
            <div
              key={metric.label}
              className={cn(
                "rounded-2xl border p-4",
                colorClasses[metric.color]
              )}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
                {metric.label}
              </p>
              <p className="mt-2 text-2xl font-bold">
                <AnimatedCounter value={metric.value} />
                <span className="ml-1 text-sm">{metric.unit}</span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
            Total plantations
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            <AnimatedCounter value={benchmarks.totalPlantations} />
          </p>
        </div>
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
            Harvested
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">
            <AnimatedCounter value={benchmarks.totalHarvested} />
          </p>
        </div>
      </div>
    </motion.section>
  );
}

