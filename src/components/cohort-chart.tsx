"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { CohortPerformance } from "@/lib/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

type CohortChartProps = {
  cohorts: CohortPerformance[];
};

const CohortChartBase = ({ cohorts }: CohortChartProps) => {
  const chartData = useMemo(() => {
    if (!cohorts.length) {
      return null;
    }

    return {
      labels: cohorts.map((cohort) => cohort.label),
      datasets: [
        {
          type: "bar" as const,
          label: "Planted",
          data: cohorts.map((cohort) => cohort.planted),
          backgroundColor: "rgba(111, 190, 69, 0.65)",
          borderRadius: 12,
          yAxisID: "y",
          order: 2,
        },
        {
          type: "bar" as const,
          label: "Harvested",
          data: cohorts.map((cohort) => cohort.harvested),
          backgroundColor: "rgba(214, 154, 58, 0.55)",
          borderRadius: 12,
          yAxisID: "y",
          order: 2,
        },
        {
          type: "line" as const,
          label: "Harvest rate",
          data: cohorts.map((cohort) => cohort.harvestRate),
          borderColor: "#3B2D1F",
          backgroundColor: "rgba(59, 45, 31, 0.15)",
          tension: 0.4,
          yAxisID: "y1",
          order: 1,
        },
      ],
    };
  }, [cohorts]);

  const headline = useMemo(() => {
    if (!cohorts.length) {
      return {
        bestLabel: null,
        bestRate: null,
        averageRate: null,
      };
    }

    const best = cohorts.reduce(
      (acc, curr) => (curr.harvestRate > acc.harvestRate ? curr : acc),
      cohorts[0]
    );
    const averageRate = Math.round(
      cohorts.reduce((sum, cohort) => sum + cohort.harvestRate, 0) /
        cohorts.length
    );

    return {
      bestLabel: best.label,
      bestRate: best.harvestRate,
      averageRate,
    };
  }, [cohorts]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.14 }}
      className="rounded-3xl border border-cream-200 bg-cream-50/85 p-5 shadow-sm shadow-cocoa-900/5 backdrop-blur"
    >
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-cocoa-900">
            Cohort Harvest Performance
          </h2>
          <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
            Planted vs harvested by cohort
          </p>
        </div>
        {headline.bestLabel && (
          <div className="flex items-center gap-4 text-xs text-cocoa-500">
            <span>
              Best cohort:{" "}
              <span className="font-semibold text-cocoa-800">
                {headline.bestLabel} ({headline.bestRate}% harvest rate)
              </span>
            </span>
            <span>
              Avg harvest rate:{" "}
              <span className="font-semibold text-cocoa-800">
                {headline.averageRate}%
              </span>
            </span>
          </div>
        )}
      </header>

      {!cohorts.length ? (
        <div className="mt-6 rounded-2xl bg-white/75 p-6 text-sm text-cocoa-500 shadow-inner">
          Cohort data will appear once plantations progress through multiple
          months of growth and harvest milestones.
        </div>
      ) : (
        <>
          <div className="mt-5 h-64">
            <Bar
              data={chartData!}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                    grid: { color: "rgba(79, 59, 31, 0.08)" },
                    title: {
                      display: true,
                      text: "Plantations",
                      color: "#3B2D1F",
                    },
                  },
                  y1: {
                    beginAtZero: true,
                    position: "right",
                    grid: { drawOnChartArea: false },
                    ticks: {
                      callback: (value) => `${value}%`,
                    },
                    title: {
                      display: true,
                      text: "Harvest rate",
                      color: "#3B2D1F",
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { usePointStyle: true },
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        context.dataset.label === "Harvest rate"
                          ? `${context.dataset.label}: ${context.formattedValue}%`
                          : `${context.dataset.label}: ${context.formattedValue}`,
                    },
                  },
                },
              }}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cohorts.map((cohort) => (
              <div
                key={cohort.key}
                className="rounded-2xl border border-cream-200 bg-white/80 p-4 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-cocoa-900">
                  {cohort.label}
                </h3>
                <div className="mt-2 flex items-center justify-between text-xs text-cocoa-600">
                  <span>Planted</span>
                  <span className="font-semibold text-cocoa-900">
                    {cohort.planted}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-cocoa-600">
                  <span>Harvested</span>
                  <span className="font-semibold text-cocoa-900">
                    {cohort.harvested}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-cocoa-600">
                  <span>Harvest rate</span>
                  <span className="font-semibold text-cocoa-900">
                    {cohort.harvestRate}%
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-cocoa-600">
                  <span>Avg. days to harvest</span>
                  <span className="font-semibold text-cocoa-900">
                    {cohort.averageDaysToHarvest ?? "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.section>
  );
};

const CohortChart = memo(CohortChartBase);

export default CohortChart;


