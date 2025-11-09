"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { Plantation } from "@/store/plantations";
import { buildAnalyticsSnapshot } from "@/lib/analytics";
import { cn } from "@/lib/cn";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type SustainabilityPanelProps = {
  plantations: Plantation[];
};

function SustainabilityPanelBase({ plantations }: SustainabilityPanelProps) {
  const snapshot = useMemo(
    () => buildAnalyticsSnapshot(plantations),
    [plantations]
  );
  const { totals, perRegion } = snapshot.sustainability;

  const carbonChartData = useMemo(() => {
    if (!perRegion.length) {
      return null;
    }

    return {
      labels: perRegion.map((stat) => stat.region),
      datasets: [
        {
          label: "Carbon offset (tCO₂)",
          data: perRegion.map((stat) => stat.carbonOffsetTons),
          backgroundColor: perRegion.map(
            (_, index) =>
              ["#8FCB9B", "#F4C95F", "#C79A5C", "#9CE26F", "#6DBE45", "#D69A3A"][
                index % 6
              ]
          ),
          borderRadius: 12,
        },
      ],
    };
  }, [perRegion]);

  const averageTreesPerHectare = useMemo(() => {
    if (!totals.areaHectares) {
      return null;
    }
    return Math.round((totals.treeCount / totals.areaHectares) * 10) / 10;
  }, [totals.areaHectares, totals.treeCount]);

  return (
    <section className="grid gap-6 lg:grid-cols-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-3xl border border-cream-200 bg-gradient-to-br from-leaf-200/60 via-cream-100 to-gold-100/60 p-5 shadow-sm shadow-cocoa-900/5 backdrop-blur lg:col-span-2"
      >
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-cocoa-900">
              Sustainability Pulse
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-cocoa-500">
              Trees • Land • Carbon
            </p>
          </div>
          <span className="text-xs text-cocoa-500">
            {new Date(snapshot.lastUpdated).toLocaleDateString()}
          </span>
        </header>

        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
            <span className="text-xs uppercase tracking-[0.3em] text-cocoa-500">
              Total canopy
            </span>
            <p className="mt-2 text-2xl font-semibold text-cocoa-900">
              {totals.treeCount.toLocaleString()} trees
            </p>
            <p className="text-xs text-cocoa-500">
              Spanning {totals.areaHectares.toLocaleString()} hectares
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-4 shadow-inner shadow-leaf-900/5">
            <span className="text-xs uppercase tracking-[0.3em] text-cocoa-500">
              Carbon balance
            </span>
            <p className="mt-2 text-2xl font-semibold text-cocoa-900">
              {totals.carbonOffsetTons.toLocaleString()} tCO₂
            </p>
            <p className="text-xs text-cocoa-500">
              Combined offset from current plantations
            </p>
          </div>

          <div className="rounded-2xl bg-cocoa-900/90 p-4 text-cream-100 shadow-sm shadow-cocoa-900/10">
            <span className="text-xs uppercase tracking-[0.3em] text-cream-400">
              Density
            </span>
            <p className="mt-2 text-2xl font-semibold">
              {averageTreesPerHectare ? (
                <>
                  {averageTreesPerHectare.toLocaleString()} trees/ha
                  <span className="ml-2 text-xs font-normal text-cream-200/80">
                    Avg cluster
                  </span>
                </>
              ) : (
                "Insufficient data"
              )}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-3xl border border-cream-200 bg-cream-50/85 p-5 shadow-sm shadow-cocoa-900/5 backdrop-blur lg:col-span-3"
      >
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-cocoa-900">
              Regional Offsets
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
              Carbon per hub
            </p>
          </div>
          <span className="text-xs text-cocoa-500">
            Highlighting top {perRegion.length} regions by offset
          </span>
        </header>

        <div className="mt-4 grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="h-64 rounded-2xl bg-white/75 p-3">
            {carbonChartData ? (
              <Bar
                data={carbonChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ${context.formattedValue}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(79, 59, 31, 0.08)" },
                      ticks: { precision: 0 },
                    },
                    x: {
                      grid: { display: false },
                    },
                  },
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-cocoa-500">
                Carbon offsets will appear as plantations report data.
              </div>
            )}
          </div>

          <div className="space-y-3">
            {perRegion.length ? (
              perRegion.map((region) => (
                <div
                  key={region.region}
                  className="rounded-2xl bg-white/80 p-4 shadow-sm shadow-cocoa-900/5"
                >
                  <div className="flex items-center justify-between text-sm font-semibold text-cocoa-900">
                    <span>{region.region}</span>
                    <span>{region.carbonOffsetTons.toLocaleString()} t</span>
                  </div>
                  <p className="mt-1 text-xs text-cocoa-500">
                    {region.treeCount.toLocaleString()} trees contributing to
                    offsets
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-white/70 p-4 text-sm text-cocoa-500 shadow-inner">
                No regional sustainability data yet. Log trees and offsets to
                activate this view.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

const SustainabilityPanel = memo(SustainabilityPanelBase);

export default SustainabilityPanel;


