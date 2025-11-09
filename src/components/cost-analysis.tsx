"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useEngagementStore } from "@/store/engagement";
import { usePlantationsStore } from "@/store/plantations";

export default function CostAnalysis() {
  const receipts = useEngagementStore((state) => state.receipts);
  const plantations = usePlantationsStore((state) => state.plantations);

  const analysis = useMemo(() => {
    const totalCosts = receipts.reduce((acc, r) => acc + r.amount, 0);
    const harvested = plantations.filter((p) => p.stage === "harvested").length;
    const totalYield = plantations.reduce((acc, p) => {
      if (p.yieldTimeline.length > 0) {
        return acc + p.yieldTimeline[p.yieldTimeline.length - 1].yieldKg;
      }
      return acc;
    }, 0);

    const costPerPlantation =
      plantations.length > 0 ? totalCosts / plantations.length : 0;
    const costPerKg = totalYield > 0 ? totalCosts / totalYield : 0;

    return {
      totalCosts,
      costPerPlantation,
      costPerKg,
      totalYield,
      harvested,
    };
  }, [receipts, plantations]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-purple-50/80 to-pink-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cocoa-900">
          Cost Analysis
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
          Analyze costs and efficiency
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-purple-200 bg-white/90 p-4">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-cocoa-400">
            Total Costs
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: receipts[0]?.currency || "USD",
            }).format(analysis.totalCosts)}
          </div>
        </div>
        <div className="rounded-xl border border-pink-200 bg-white/90 p-4">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-cocoa-400">
            Cost per Plantation
          </div>
          <div className="text-2xl font-bold text-pink-700">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: receipts[0]?.currency || "USD",
            }).format(analysis.costPerPlantation)}
          </div>
        </div>
        <div className="rounded-xl border border-violet-200 bg-white/90 p-4">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-cocoa-400">
            Cost per Kg
          </div>
          <div className="text-2xl font-bold text-violet-700">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: receipts[0]?.currency || "USD",
            }).format(analysis.costPerKg)}
          </div>
        </div>
        <div className="rounded-xl border border-fuchsia-200 bg-white/90 p-4">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-cocoa-400">
            Total Yield
          </div>
          <div className="text-2xl font-bold text-fuchsia-700">
            {analysis.totalYield.toFixed(0)} kg
          </div>
        </div>
      </div>
    </motion.section>
  );
}
