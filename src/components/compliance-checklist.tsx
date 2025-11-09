"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ComplianceChecklist() {
  const [checklist, setChecklist] = useState([
    {
      id: "organic-cert",
      label: "Organic Certification",
      checked: false,
      category: "certification",
    },
    {
      id: "fair-trade",
      label: "Fair Trade Compliance",
      checked: true,
      category: "certification",
    },
    {
      id: "environmental",
      label: "Environmental Regulations",
      checked: true,
      category: "regulations",
    },
    {
      id: "labor-standards",
      label: "Labor Standards",
      checked: true,
      category: "regulations",
    },
    {
      id: "quality-control",
      label: "Quality Control Standards",
      checked: false,
      category: "quality",
    },
    {
      id: "safety-protocols",
      label: "Safety Protocols",
      checked: true,
      category: "safety",
    },
  ]);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const completedCount = checklist.filter((item) => item.checked).length;
  const completionRate = (completedCount / checklist.length) * 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-cocoa-900">
              Compliance Checklist
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
              Track compliance requirements
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-700">
              {Math.round(completionRate)}%
            </div>
            <div className="text-xs text-cocoa-500">
              {completedCount}/{checklist.length}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {checklist.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-blue-200 bg-white/80 p-3 transition hover:bg-blue-50/50"
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              className="h-4 w-4 rounded border-cream-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
            />
            <span
              className={`flex-1 text-sm ${
                item.checked
                  ? "font-semibold text-cocoa-900 line-through"
                  : "text-cocoa-700"
              }`}
            >
              {item.label}
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              {item.category}
            </span>
          </label>
        ))}
      </div>
    </motion.section>
  );
}
