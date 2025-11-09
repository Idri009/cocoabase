"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export default function SeasonalPlanner() {
  const currentMonth = new Date().getMonth();
  const seasons = useMemo(() => {
    return [
      {
        name: "Planting Season",
        months: [3, 4, 5], // April, May, June
        icon: "🌱",
        activities: ["Prepare soil", "Plant seeds", "Initial watering"],
        isActive: [3, 4, 5].includes(currentMonth),
      },
      {
        name: "Growing Season",
        months: [6, 7, 8, 9], // July, August, September, October
        icon: "🌿",
        activities: ["Regular watering", "Fertilizing", "Pest control"],
        isActive: [6, 7, 8, 9].includes(currentMonth),
      },
      {
        name: "Harvest Season",
        months: [10, 11, 0, 1], // November, December, January, February
        icon: "🚚",
        activities: ["Harvest pods", "Process beans", "Market preparation"],
        isActive: [10, 11, 0, 1].includes(currentMonth),
      },
      {
        name: "Maintenance Season",
        months: [2], // March
        icon: "🔧",
        activities: ["Pruning", "Soil testing", "Equipment maintenance"],
        isActive: [2].includes(currentMonth),
      },
    ];
  }, [currentMonth]);

  const currentSeason = seasons.find((s) => s.isActive) || seasons[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-orange-50/80 to-amber-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cocoa-900">
          Seasonal Planner
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
          Plan by season
        </p>
      </div>

      <div className="space-y-3">
        {seasons.map((season) => (
          <div
            key={season.name}
            className={`rounded-xl border p-4 ${
              season.isActive
                ? "border-orange-300 bg-orange-50/80 shadow-sm"
                : "border-cream-200 bg-white/80"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{season.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-cocoa-900">
                    {season.name}
                  </h3>
                  {season.isActive && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                      CURRENT
                    </span>
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  {season.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-cocoa-600"
                    >
                      • {activity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
