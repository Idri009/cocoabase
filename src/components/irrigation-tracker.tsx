"use client";

import { useState, FormEvent, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useIrrigationStore,
  type IrrigationRecord,
} from "@/store/irrigation";
import { usePlantationsStore } from "@/store/plantations";
import AnimatedCounter from "./animated-counter";

export default function IrrigationTracker() {
  const records = useIrrigationStore((state) => state.records);
  const addRecord = useIrrigationStore((state) => state.addRecord);
  const removeRecord = useIrrigationStore((state) => state.removeRecord);
  const getTotalWaterUsage = useIrrigationStore(
    (state) => state.getTotalWaterUsage
  );
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<IrrigationRecord>>({
    method: "sprinkler",
    durationMinutes: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const totalWaterUsage = getTotalWaterUsage();
  const monthlyUsage = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return getTotalWaterUsage(
      startOfMonth.toISOString().split("T")[0],
      endOfMonth.toISOString().split("T")[0]
    );
  }, [records, getTotalWaterUsage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.plantationId || form.durationMinutes === undefined) {
      return;
    }
    addRecord({
      plantationId: form.plantationId,
      date: form.date || new Date().toISOString().split("T")[0],
      method: form.method ?? "sprinkler",
      durationMinutes: form.durationMinutes ?? 0,
      waterVolumeLiters: form.waterVolumeLiters,
      soilMoistureBefore: form.soilMoistureBefore,
      soilMoistureAfter: form.soilMoistureAfter,
      weatherConditions: form.weatherConditions,
      notes: form.notes,
    });
    setForm({
      method: "sprinkler",
      durationMinutes: 0,
      date: new Date().toISOString().split("T")[0],
    });
    setIsAdding(false);
  };

  const methods: IrrigationRecord["method"][] = [
    "sprinkler",
    "drip",
    "flood",
    "manual",
    "other",
  ];

  const recentRecords = [...records]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

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
            Irrigation tracker
          </h2>
          <p className="text-sm text-slate-300/80">
            Monitor water usage and soil moisture levels.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Log irrigation"}
        </button>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">
            Total water usage
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-300">
            <AnimatedCounter value={totalWaterUsage} /> L
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
            This month
          </p>
          <p className="mt-2 text-2xl font-bold text-cyan-300">
            <AnimatedCounter value={monthlyUsage} /> L
          </p>
        </div>
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
              Plantation
              <select
                value={form.plantationId || ""}
                onChange={(e) =>
                  setForm({ ...form, plantationId: e.target.value })
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                <option value="">Select plantation</option>
                {plantations.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.seedName}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Method
              <select
                value={form.method}
                onChange={(e) =>
                  setForm({
                    ...form,
                    method: e.target.value as IrrigationRecord["method"],
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {methods.map((method) => (
                  <option key={method} value={method}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Date
              <input
                type="date"
                value={form.date || ""}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Duration (minutes)
              <input
                type="number"
                value={form.durationMinutes || 0}
                onChange={(e) =>
                  setForm({
                    ...form,
                    durationMinutes: Number(e.target.value),
                  })
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Water volume (liters)
              <input
                type="number"
                step="0.1"
                value={form.waterVolumeLiters || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    waterVolumeLiters: Number(e.target.value) || undefined,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Soil moisture before (%)
              <input
                type="number"
                step="0.1"
                value={form.soilMoistureBefore || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    soilMoistureBefore: Number(e.target.value) || undefined,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Soil moisture after (%)
              <input
                type="number"
                step="0.1"
                value={form.soilMoistureAfter || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    soilMoistureAfter: Number(e.target.value) || undefined,
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
            Log irrigation
          </button>
        </motion.form>
      )}

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">
          Recent irrigation records
        </h3>
        {recentRecords.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No irrigation records yet. Log your first irrigation to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentRecords.map((record) => {
              const plantation = plantations.find(
                (p) => p.id === record.plantationId
              );
              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-900/50 p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {plantation && (
                        <span className="text-sm font-semibold text-white">
                          {plantation.seedName}
                        </span>
                      )}
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                        {record.method}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                      <span>{record.durationMinutes} min</span>
                      {record.waterVolumeLiters && (
                        <span>{record.waterVolumeLiters} L</span>
                      )}
                      {record.soilMoistureAfter && (
                        <span>Moisture: {record.soilMoistureAfter}%</span>
                      )}
                      <span>
                        {new Date(record.date).toLocaleDateString()}
                      </span>
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
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}

