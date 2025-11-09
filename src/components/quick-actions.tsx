"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePlantationsStore } from "@/store/plantations";
import { useAlertsStore } from "@/store/alerts";

export default function QuickActions() {
  const plantations = usePlantationsStore((state) => state.plantations);
  const alerts = useAlertsStore((state) => state.alerts);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const unreadAlerts = alerts.filter((a) => !a.acknowledgedAt).length;
  const activePlantations = plantations.filter(
    (p) => p.stage === "growing" || p.stage === "planted"
  ).length;

  const actions = [
    {
      id: "add-plantation",
      label: "Add Plantation",
      icon: "🌱",
      color: "emerald",
      count: null,
    },
    {
      id: "view-alerts",
      label: "View Alerts",
      icon: "🔔",
      color: "rose",
      count: unreadAlerts,
    },
    {
      id: "add-task",
      label: "Add Task",
      icon: "✅",
      color: "blue",
      count: null,
    },
    {
      id: "view-plantations",
      label: "Active Plantations",
      icon: "🌿",
      color: "amber",
      count: activePlantations,
    },
    {
      id: "add-expense",
      label: "Add Expense",
      icon: "💰",
      color: "purple",
      count: null,
    },
    {
      id: "view-reports",
      label: "View Reports",
      icon: "📊",
      color: "cyan",
      count: null,
    },
  ];

  const handleAction = (actionId: string) => {
    setActiveAction(actionId);
    setTimeout(() => setActiveAction(null), 300);
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      emerald: "border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100/80",
      rose: "border-rose-200 bg-rose-50/80 hover:bg-rose-100/80",
      blue: "border-blue-200 bg-blue-50/80 hover:bg-blue-100/80",
      amber: "border-amber-200 bg-amber-50/80 hover:bg-amber-100/80",
      purple: "border-purple-200 bg-purple-50/80 hover:bg-purple-100/80",
      cyan: "border-cyan-200 bg-cyan-50/80 hover:bg-cyan-100/80",
    };
    return colorMap[color] || "border-slate-200 bg-slate-50/80";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-green-50/80 to-emerald-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cocoa-900">Quick Actions</h2>
        <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
          Common operations
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            type="button"
            onClick={() => handleAction(action.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative rounded-xl border p-3 text-left transition ${getColorClasses(action.color)} ${
              activeAction === action.id ? "ring-2 ring-cocoa-400" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{action.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-cocoa-900 truncate">
                  {action.label}
                </p>
                {action.count !== null && (
                  <p className="text-xs text-cocoa-600">{action.count}</p>
                )}
              </div>
            </div>
            {action.count !== null && action.count > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                {action.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
