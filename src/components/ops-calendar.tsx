"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type {
  Plantation,
  GrowthStage,
  PlantationTask,
} from "@/store/plantations";
import { buildAnalyticsSnapshot } from "@/lib/analytics";

type CalendarEvent = {
  id: string;
  date: Date;
  type: "task" | "stage_change" | "forecast_harvest";
  title: string;
  description: string;
  plantationId: string;
  plantationName: string;
  severity?: "low" | "medium" | "high";
  task?: PlantationTask;
};

const stageLabels: Record<GrowthStage, string> = {
  planted: "Planted",
  growing: "Growing",
  harvested: "Harvested",
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type OpsCalendarProps = {
  plantations: Plantation[];
};

export default function OpsCalendar({ plantations }: OpsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const analyticsSnapshot = useMemo(
    () => buildAnalyticsSnapshot(plantations, []),
    [plantations]
  );

  const events = useMemo(() => {
    const eventList: CalendarEvent[] = [];

    plantations.forEach((plantation) => {
      plantation.tasks.forEach((task) => {
        if (task.status === "completed") {
          return;
        }
        const dueDate = new Date(task.dueDate);
        if (Number.isNaN(dueDate.getTime())) {
          return;
        }
        const now = new Date();
        const daysUntilDue = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        const severity =
          daysUntilDue < 0
            ? "high"
            : daysUntilDue <= 3
            ? "medium"
            : "low";

        eventList.push({
          id: `task-${plantation.id}-${task.id}`,
          date: dueDate,
          type: "task",
          title: task.title,
          description: `${plantation.seedName} • ${task.status}`,
          plantationId: plantation.id,
          plantationName: plantation.seedName,
          severity,
          task,
        });
      });

      const stageChangeDate = new Date(plantation.updatedAt);
      if (!Number.isNaN(stageChangeDate.getTime())) {
        eventList.push({
          id: `stage-${plantation.id}`,
          date: stageChangeDate,
          type: "stage_change",
          title: `Stage: ${stageLabels[plantation.stage]}`,
          description: `${plantation.seedName} • ${plantation.location ?? "Unknown location"}`,
          plantationId: plantation.id,
          plantationName: plantation.seedName,
          severity: "low",
        });
      }
    });

    analyticsSnapshot.yieldForecasts?.forEach((forecast) => {
      const plantation = plantations.find((p) => p.id === forecast.plantationId);
      if (!plantation) {
        return;
      }
      const harvestDate = new Date(forecast.projectedHarvestDate);
      if (Number.isNaN(harvestDate.getTime())) {
        return;
      }
      eventList.push({
        id: `forecast-${forecast.plantationId}`,
        date: harvestDate,
        type: "forecast_harvest",
        title: `Forecast harvest`,
        description: `${plantation.seedName} • ${forecast.projectedYieldKg.toFixed(1)} kg`,
        plantationId: forecast.plantationId,
        plantationName: plantation.seedName,
        severity: "medium",
      });
    });

    return eventList.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }, [plantations, analyticsSnapshot]);

  const monthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const monthEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const daysInView = viewMode === "month" ? 42 : 7;
  const calendarDays: Date[] = [];
  for (let i = 0; i < daysInView; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    calendarDays.push(date);
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const selectedDateEvents = selectedDate
    ? getEventsForDate(selectedDate)
    : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cocoa-800/60 bg-[#101f3c]/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur"
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Operations calendar
          </h2>
          <p className="text-sm text-slate-300/80">
            Merged schedule of task deadlines, stage changes, and forecast
            harvest dates.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "month" ? "week" : "month")}
            className="rounded-full border border-slate-600/40 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-slate-400/60 hover:text-white"
          >
            {viewMode === "month" ? "Week view" : "Month view"}
          </button>
          <button
            type="button"
            onClick={goToToday}
            className="rounded-full border border-slate-600/40 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-slate-400/60 hover:text-white"
          >
            Today
          </button>
        </div>
      </header>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateMonth("prev")}
          className="rounded-full border border-slate-600/40 bg-slate-900/60 p-2 text-slate-200 transition hover:border-slate-400/60 hover:text-white"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          type="button"
          onClick={() => navigateMonth("next")}
          className="rounded-full border border-slate-600/40 bg-slate-900/60 p-2 text-slate-200 transition hover:border-slate-400/60 hover:text-white"
        >
          →
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400/70"
          >
            {day}
          </div>
        ))}
        {calendarDays.map((date, index) => {
          const isCurrentMonth =
            date.getMonth() === currentDate.getMonth();
          const isToday =
            date.toDateString() === new Date().toDateString();
          const dayEvents = getEventsForDate(date);
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={cn(
                "relative min-h-[80px] rounded-xl border p-2 text-left transition",
                !isCurrentMonth && "opacity-30",
                isToday
                  ? "border-leaf-400/60 bg-leaf-500/10"
                  : "border-slate-700/40 bg-slate-900/50 hover:border-slate-500/60",
                selectedDate?.toDateString() === date.toDateString() &&
                  "ring-2 ring-leaf-400/60"
              )}
            >
              <span
                className={cn(
                  "text-sm font-semibold",
                  isToday ? "text-leaf-300" : "text-slate-300/80"
                )}
              >
                {date.getDate()}
              </span>
              {hasEvents && (
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "truncate rounded px-1 py-0.5 text-[10px] font-semibold",
                        event.type === "task" &&
                          event.severity === "high" &&
                          "bg-rose-500/20 text-rose-300",
                        event.type === "task" &&
                          event.severity === "medium" &&
                          "bg-amber-500/20 text-amber-300",
                        event.type === "task" &&
                          event.severity === "low" &&
                          "bg-sky-500/20 text-sky-300",
                        event.type === "stage_change" &&
                          "bg-purple-500/20 text-purple-300",
                        event.type === "forecast_harvest" &&
                          "bg-emerald-500/20 text-emerald-300"
                      )}
                    >
                      {event.type === "task" && "📋"}
                      {event.type === "stage_change" && "🌿"}
                      {event.type === "forecast_harvest" && "🌾"}{" "}
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-slate-400/70">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h4>
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          {selectedDateEvents.length === 0 ? (
            <p className="mt-3 text-sm text-slate-300/80">
              No events scheduled for this date.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {selectedDateEvents.map((event) => (
                <li
                  key={event.id}
                  className="rounded-xl border border-slate-700/40 bg-slate-950/60 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-300/70">
                        {event.description}
                      </p>
                      {event.task && (
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400/80">
                          <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                            {event.task.status}
                          </span>
                          {event.task.assigneeId && (
                            <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                              Assigned
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-semibold",
                        event.type === "task" &&
                          event.severity === "high" &&
                          "bg-rose-500/20 text-rose-300",
                        event.type === "task" &&
                          event.severity === "medium" &&
                          "bg-amber-500/20 text-amber-300",
                        event.type === "task" &&
                          event.severity === "low" &&
                          "bg-sky-500/20 text-sky-300",
                        event.type === "stage_change" &&
                          "bg-purple-500/20 text-purple-300",
                        event.type === "forecast_harvest" &&
                          "bg-emerald-500/20 text-emerald-300"
                      )}
                    >
                      {event.type === "task" && "Task"}
                      {event.type === "stage_change" && "Stage"}
                      {event.type === "forecast_harvest" && "Forecast"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-300/70">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-sky-500/20 border border-sky-500/40" />
          <span>Task (low priority)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
          <span>Task (medium priority)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/20 border border-rose-500/40" />
          <span>Task (high priority)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-purple-500/20 border border-purple-500/40" />
          <span>Stage change</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          <span>Forecast harvest</span>
        </div>
      </div>
    </motion.section>
  );
}

