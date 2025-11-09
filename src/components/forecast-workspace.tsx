"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { Plantation } from "@/store/plantations";
import type { AnalyticsSnapshot, ScenarioName } from "@/lib/analytics";
import { cn } from "@/lib/cn";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type ForecastWorkspaceProps = {
  plantations: Plantation[];
  snapshot: AnalyticsSnapshot;
};

const scenarioLabels: Record<ScenarioName, string> = {
  best: "Best case",
  base: "Base case",
  worst: "Worst case",
};

const scenarioColors: Record<ScenarioName, string> = {
  best: "#4CAF50",
  base: "#2F4858",
  worst: "#D97B66",
};

const ForecastWorkspace = ({ snapshot }: ForecastWorkspaceProps) => {
  const [activeScenario, setActiveScenario] = useState<ScenarioName>("base");

  const rankedScenarios = useMemo(
    () =>
      snapshot.scenarioForecasts
        .map((item) => {
          const baseScenario = item.scenarios.find(
            (scenario) => scenario.name === "base"
          );
          return {
            ...item,
            baseProjected: baseScenario?.projectedYieldKg ?? 0,
          };
        })
        .sort((a, b) => b.baseProjected - a.baseProjected)
        .slice(0, 6),
    [snapshot.scenarioForecasts]
  );

  const chartData = useMemo(() => {
    const labels = rankedScenarios.map((item) => item.seedName);
    return {
      labels,
      datasets: (["best", "base", "worst"] as ScenarioName[]).map((name) => ({
        type: "line" as const,
        label: scenarioLabels[name],
        data: rankedScenarios.map((item) => {
          const scenario = item.scenarios.find(
            (scn) => scn.name === name
          );
          return scenario?.projectedYieldKg ?? 0;
        }),
        borderColor: scenarioColors[name],
        backgroundColor: scenarioColors[name],
        tension: 0.35,
        pointRadius: name === activeScenario ? 5 : 3,
        hidden: activeScenario !== name,
      })),
    };
  }, [activeScenario, rankedScenarios]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: { parsed: number }) =>
              `${context.parsed.toLocaleString()} kg`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (value: number | string) =>
              typeof value === "number"
                ? `${value.toLocaleString()} kg`
                : value,
          },
          grid: {
            color: "rgba(47, 72, 88, 0.08)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    }),
    []
  );

  const recentTimeline = useMemo(
    () =>
      snapshot.yieldTimeline
        .slice()
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 8),
    [snapshot.yieldTimeline]
  );

  if (!snapshot.scenarioForecasts.length) {
    return null;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.7fr,1fr]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-3xl border border-cream-200 bg-white/90 p-5 shadow-sm shadow-cocoa-900/5 backdrop-blur"
      >
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-cocoa-900">
              Forecast Workspace
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
              Yield projections & scenarios
            </p>
          </div>

          <div className="flex gap-2">
            {(["best", "base", "worst"] as ScenarioName[]).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setActiveScenario(name)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-offset-2",
                  activeScenario === name
                    ? "bg-cocoa-900 text-cream-50 focus:ring-cocoa-500 focus:ring-offset-white"
                    : "border border-cream-200 text-cocoa-600 hover:border-cocoa-300 hover:text-cocoa-900 focus:ring-cocoa-300 focus:ring-offset-white"
                )}
              >
                {scenarioLabels[name]}
              </button>
            ))}
          </div>
        </header>

        <div className="mt-5 h-64 w-full">
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {rankedScenarios.map((item) => {
            const active = item.scenarios.find(
              (scenario) => scenario.name === activeScenario
            );
            if (!active) {
              return null;
            }
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-cream-200 bg-cream-50/80 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-cocoa-900">
                      {item.seedName}
                    </p>
                    <p className="text-xs text-cocoa-500">
                      Projection date:{" "}
                      {new Date(active.projectionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cocoa-500">
                    {item.stage}
                  </span>
                </div>
                <p className="mt-3 text-xl font-semibold text-cocoa-900">
                  {active.projectedYieldKg.toLocaleString()} kg
                </p>
                <p className="text-xs text-cocoa-500">{active.basis}</p>
                <p className="mt-2 text-xs text-cocoa-500">
                  Confidence:{" "}
                  <span className="font-semibold uppercase text-cocoa-900">
                    {active.confidence}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="flex flex-col gap-4 rounded-3xl border border-cream-200 bg-cream-50/85 p-5 shadow-inner shadow-cocoa-900/5 backdrop-blur"
      >
        <header>
          <h3 className="text-sm font-semibold text-cocoa-900">
            Recent Yield Checkpoints
          </h3>
          <p className="text-xs text-cocoa-500">
            Logged agronomic events driving forecasts
          </p>
        </header>
        <ul className="space-y-3 text-sm text-cocoa-700">
          {recentTimeline.map((entry) => (
            <li
              key={`${entry.plantationId}-${entry.date}-${entry.event}`}
              className="rounded-2xl border border-cream-200 bg-white/80 px-3 py-2 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-cocoa-900">
                    {entry.event}
                  </p>
                  <p className="text-xs text-cocoa-500">
                    {entry.seedName} • {entry.stage}
                  </p>
                </div>
                <span className="text-xs text-cocoa-500">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-xs text-cocoa-500">
                Recorded yield:{" "}
                <span className="font-semibold text-cocoa-900">
                  {entry.yieldKg.toLocaleString()} kg
                </span>
              </p>
            </li>
          ))}
          {recentTimeline.length === 0 ? (
            <li className="rounded-2xl bg-white/70 px-3 py-2 text-xs text-cocoa-500 shadow-inner">
              No checkpoints logged yet. Add yield events to unlock forecast
              telemetry.
            </li>
          ) : null}
        </ul>
      </motion.aside>
    </section>
  );
};

export default ForecastWorkspace;


