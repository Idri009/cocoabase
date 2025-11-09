"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import AnimatedCounter from "./animated-counter";
import type { Plantation } from "@/store/plantations";

type QuickStatsWidgetProps = {
  plantations: Plantation[];
  className?: string;
};

export default function QuickStatsWidget({
  plantations,
  className,
}: QuickStatsWidgetProps) {
  const stats = useMemo(() => {
    const totalTrees = plantations.reduce((sum, p) => sum + p.treeCount, 0);
    const totalCarbon = plantations.reduce(
      (sum, p) => sum + p.carbonOffsetTons,
      0
    );
    const totalArea = plantations.reduce(
      (sum, p) => sum + p.areaHectares,
      0
    );
    const totalTasks = plantations.reduce(
      (sum, p) => sum + p.tasks.length,
      0
    );
    const completedTasks = plantations.reduce(
      (sum, p) =>
        sum + p.tasks.filter((t) => t.status === "completed").length,
      0
    );
    const taskCompletionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const harvestedCount = plantations.filter(
      (p) => p.stage === "harvested"
    ).length;
    const growingCount = plantations.filter((p) => p.stage === "growing").length;
    const plantedCount = plantations.filter((p) => p.stage === "planted").length;

    return {
      totalTrees,
      totalCarbon,
      totalArea,
      totalTasks,
      completedTasks,
      taskCompletionRate,
      harvestedCount,
      growingCount,
      plantedCount,
    };
  }, [plantations]);

  const statCards = [
    {
      label: "Total trees",
      value: stats.totalTrees,
      suffix: "",
      icon: "🌳",
      color: "text-emerald-300",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
    },
    {
      label: "Carbon offset",
      value: stats.totalCarbon,
      suffix: " tCO₂",
      icon: "🌍",
      color: "text-leaf-300",
      bgColor: "bg-leaf-500/10",
      borderColor: "border-leaf-500/30",
    },
    {
      label: "Total area",
      value: stats.totalArea,
      suffix: " ha",
      icon: "🗺️",
      color: "text-sky-300",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/30",
    },
    {
      label: "Task completion",
      value: stats.taskCompletionRate,
      suffix: "%",
      icon: "✅",
      color: "text-amber-300",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "rounded-2xl border p-4",
            stat.bgColor,
            stat.borderColor
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                {stat.label}
              </p>
              <p className={cn("mt-2 text-2xl font-bold", stat.color)}>
                <AnimatedCounter
                  value={stat.value}
                  decimals={stat.label === "Task completion" ? 1 : 0}
                  suffix={stat.suffix}
                />
              </p>
            </div>
            <span className="text-3xl opacity-50">{stat.icon}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

