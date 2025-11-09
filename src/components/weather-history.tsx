"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useWeatherHistoryStore,
  type WeatherRecord,
  type WeatherCondition,
} from "@/store/weather-history";
import { usePlantationsStore } from "@/store/plantations";
import AnimatedCounter from "./animated-counter";

export default function WeatherHistory() {
  const records = useWeatherHistoryStore((state) => state.records);
  const addRecord = useWeatherHistoryStore((state) => state.addRecord);
  const removeRecord = useWeatherHistoryStore((state) => state.removeRecord);
  const getAverageRainfall = useWeatherHistoryStore(
    (state) => state.getAverageRainfall
  );
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<WeatherRecord>>({
    condition: "sunny",
    temperature: 25,
    humidity: 60,
    rainfall: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const avgRainfall = getAverageRainfall();
  const recentRecords = [...records]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.date) {
      return;
    }
    addRecord({
      date: form.date,
      location: form.location,
      plantationId: form.plantationId,
      condition: form.condition ?? "sunny",
      temperature: form.temperature ?? 25,
      humidity: form.humidity ?? 60,
      rainfall: form.rainfall ?? 0,
      windSpeed: form.windSpeed,
      notes: form.notes,
    });
    setForm({
      condition: "sunny",
      temperature: 25,
      humidity: 60,
      rainfall: 0,
      date: new Date().toISOString().split("T")[0],
    });
    setIsAdding(false);
  };

  const conditions: WeatherCondition[] = [
    "sunny",
    "cloudy",
    "rainy",
    "stormy",
    "windy",
    "foggy",
    "snowy",
  ];

  const getConditionEmoji = (condition: WeatherCondition) => {
    const emojiMap: Record<WeatherCondition, string> = {
      sunny: "☀️",
      cloudy: "☁️",
      rainy: "🌧️",
      stormy: "⛈️",
      windy: "💨",
      foggy: "🌫️",
      snowy: "❄️",
    };
    return emojiMap[condition];
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
          <h2 className="text-lg font-semibold text-white">Weather history</h2>
          <p className="text-sm text-slate-300/80">
            Track historical weather data for your plantations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add record"}
        </button>
      </header>

      <div className="mt-6 rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">
          Average rainfall
        </p>
        <p className="mt-2 text-2xl font-bold text-blue-300">
          <AnimatedCounter value={avgRainfall} /> mm
        </p>
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
              Date
              <input
                type="date"
                value={form.date || ""}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Condition
              <select
                value={form.condition}
                onChange={(e) =>
                  setForm({
                    ...form,
                    condition: e.target.value as WeatherCondition,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {getConditionEmoji(cond)} {cond.charAt(0).toUpperCase() + cond.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Temperature (°C)
              <input
                type="number"
                step="0.1"
                value={form.temperature || 25}
                onChange={(e) =>
                  setForm({ ...form, temperature: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Humidity (%)
              <input
                type="number"
                step="0.1"
                value={form.humidity || 60}
                onChange={(e) =>
                  setForm({ ...form, humidity: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Rainfall (mm)
              <input
                type="number"
                step="0.1"
                value={form.rainfall || 0}
                onChange={(e) =>
                  setForm({ ...form, rainfall: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Wind speed (km/h)
              <input
                type="number"
                step="0.1"
                value={form.windSpeed || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    windSpeed: Number(e.target.value) || undefined,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Add record
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-2">
        {recentRecords.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No weather records yet. Add your first record to get started.
            </p>
          </div>
        ) : (
          recentRecords.map((record) => {
            const plantation = plantations.find(
              (p) => p.id === record.plantationId
            );
            return (
              <div
                key={record.id}
                className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-900/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {getConditionEmoji(record.condition)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      {plantation && (
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                          {plantation.seedName}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                      <span>🌡️ {record.temperature}°C</span>
                      <span>💧 {record.humidity}%</span>
                      <span>🌧️ {record.rainfall}mm</span>
                      {record.windSpeed && (
                        <span>💨 {record.windSpeed} km/h</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeRecord(record.id)}
                  className="ml-2 rounded-full bg-slate-800/70 p-2 text-slate-200/90 transition hover:bg-slate-700/80"
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </motion.section>
  );
}

