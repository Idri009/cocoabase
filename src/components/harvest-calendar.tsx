"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { usePlantationsStore } from "@/store/plantations";

export default function HarvestCalendar() {
  const plantations = usePlantationsStore((state) => state.plantations);

  const upcomingHarvests = useMemo(() => {
    const harvests: Array<{
      date: string;
      plantations: string[];
      count: number;
    }> = [];

    plantations.forEach((plantation) => {
      if (plantation.stage === "growing") {
        const daysSinceStart = Math.ceil(
          (Date.now() - new Date(plantation.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const estimatedHarvestDays = 180;
        const daysUntil = estimatedHarvestDays - daysSinceStart;
        const harvestDate = new Date(
          Date.now() + daysUntil * 24 * 60 * 60 * 1000
        );
        const dateKey = harvestDate.toISOString().split("T")[0];

        const existing = harvests.find((h) => h.date === dateKey);
        if (existing) {
          existing.plantations.push(plantation.seedName);
          existing.count++;
        } else {
          harvests.push({
            date: dateKey,
            plantations: [plantation.seedName],
            count: 1,
          });
        }
      }
    });

    return harvests
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 7);
  }, [plantations]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-amber-50/80 to-yellow-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cocoa-900">
          Harvest Calendar
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
          Upcoming harvest schedule
        </p>
      </div>

      <div className="space-y-3">
        {upcomingHarvests.length === 0 ? (
          <div className="rounded-xl border border-cream-200 bg-cream-50/70 p-6 text-center">
            <span className="text-4xl">📅</span>
            <p className="mt-2 text-sm text-cocoa-600">
              No upcoming harvests scheduled
            </p>
          </div>
        ) : (
          upcomingHarvests.map((harvest) => (
            <div
              key={harvest.date}
              className="rounded-xl border border-amber-200 bg-white/80 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <h3 className="font-semibold text-cocoa-900">
                      {new Date(harvest.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-cocoa-600">
                    {harvest.count} plantation{harvest.count !== 1 ? "s" : ""}{" "}
                    ready
                  </p>
                  <p className="mt-1 text-xs text-cocoa-500">
                    {harvest.plantations.slice(0, 2).join(", ")}
                    {harvest.plantations.length > 2 &&
                      ` +${harvest.plantations.length - 2} more`}
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {harvest.count}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}
