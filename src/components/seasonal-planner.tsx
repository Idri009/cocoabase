"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useSeasonalPlannerStore,
  type SeasonalActivity,
  type Season,
  type ActivityType,
} from "@/store/seasonal-planner";
import { usePlantationsStore } from "@/store/plantations";

export default function SeasonalPlanner() {
  const activities = useSeasonalPlannerStore((state) => state.activities);
  const addActivity = useSeasonalPlannerStore((state) => state.addActivity);
  const updateActivity = useSeasonalPlannerStore(
    (state) => state.updateActivity
  );
  const removeActivity = useSeasonalPlannerStore(
    (state) => state.removeActivity
  );
  const getUpcomingActivities = useSeasonalPlannerStore(
    (state) => state.getUpcomingActivities
  );
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season | "all">("all");
  const [form, setForm] = useState<Partial<SeasonalActivity>>({
    season: "spring",
    year: new Date().getFullYear(),
    activityType: "planting",
    priority: "medium",
    status: "planned",
  });

  const upcomingActivities = getUpcomingActivities(30);
  const filteredActivities =
    selectedSeason === "all"
      ? activities
      : activities.filter((a) => a.season === selectedSeason);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      return;
    }
    addActivity({
      season: form.season ?? "spring",
      year: form.year ?? new Date().getFullYear(),
      activityType: form.activityType ?? "planting",
      title: form.title,
      description: form.description,
      plantationId: form.plantationId,
      scheduledDate: form.scheduledDate,
      priority: form.priority ?? "medium",
      status: form.status ?? "planned",
      notes: form.notes,
    });
    setForm({
      season: "spring",
      year: new Date().getFullYear(),
      activityType: "planting",
      priority: "medium",
      status: "planned",
    });
    setIsAdding(false);
  };

  const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
  const activityTypes: ActivityType[] = [
    "planting",
    "harvesting",
    "pruning",
    "fertilizing",
    "irrigation",
    "pest_control",
    "maintenance",
    "other",
  ];

  const getPriorityColor = (priority: SeasonalActivity["priority"]) => {
    switch (priority) {
      case "high":
        return "border-rose-500/60 bg-rose-500/20 text-rose-300";
      case "medium":
        return "border-blue-500/60 bg-blue-500/20 text-blue-300";
      case "low":
        return "border-slate-500/60 bg-slate-500/20 text-slate-300";
    }
  };

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
            Seasonal planner
          </h2>
          <p className="text-sm text-slate-300/80">
            Plan activities by season for optimal crop management.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add activity"}
        </button>
      </header>

      {upcomingActivities.length > 0 && (
        <div className="mt-4 rounded-xl border border-blue-500/40 bg-blue-500/10 p-3">
          <p className="text-sm font-semibold text-blue-300">
            📅 {upcomingActivities.length} upcoming activity(ies) in the next 30 days
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {(["all", ...seasons] as const).map((season) => (
          <button
            key={season}
            type="button"
            onClick={() => setSelectedSeason(season)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              selectedSeason === season
                ? "bg-leaf-500/20 text-leaf-300 border border-leaf-400/40"
                : "bg-slate-800/80 text-slate-300/70 hover:bg-slate-700/80"
            )}
          >
            {season === "all" ? "All" : season.charAt(0).toUpperCase() + season.slice(1)}
          </button>
        ))}
      </div>

      {isAdding && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleSubmit}
          className="mt-4 space-y-3 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Title
              <input
                type="text"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Activity type
              <select
                value={form.activityType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    activityType: e.target.value as ActivityType,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ").replace(/\b\w/g, (l) =>
                      l.toUpperCase()
                    )}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Season
              <select
                value={form.season}
                onChange={(e) =>
                  setForm({ ...form, season: e.target.value as Season })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {seasons.map((season) => (
                  <option key={season} value={season}>
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Priority
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as SeasonalActivity["priority"],
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Scheduled date
              <input
                type="date"
                value={form.scheduledDate || ""}
                onChange={(e) =>
                  setForm({ ...form, scheduledDate: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Add activity
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              {selectedSeason === "all"
                ? "No activities yet. Add your first activity to get started."
                : `No activities for ${selectedSeason}.`}
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const plantation = plantations.find(
              (p) => p.id === activity.plantationId
            );
            return (
              <div
                key={activity.id}
                className={cn(
                  "rounded-xl border p-4",
                  getPriorityColor(activity.priority)
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">
                        {activity.title}
                      </h3>
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                        {activity.season} {activity.year}
                      </span>
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                        {activity.activityType.replace("_", " ")}
                      </span>
                    </div>
                    {activity.description && (
                      <p className="mt-1 text-xs text-slate-300/70">
                        {activity.description}
                      </p>
                    )}
                    {activity.scheduledDate && (
                      <p className="mt-1 text-xs text-slate-300/70">
                        📅 {new Date(activity.scheduledDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.status !== "completed" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateActivity(activity.id, { status: "completed" })
                        }
                        className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-200/90 transition hover:bg-slate-700/80"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeActivity(activity.id)}
                      className="rounded-full bg-slate-800/70 p-2 text-slate-200/90 transition hover:bg-slate-700/80"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.section>
  );
}

