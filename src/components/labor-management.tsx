"use client";

import { useState, FormEvent, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useLaborStore,
  type LaborRecord,
  type LaborRole,
} from "@/store/labor";
import { usePlantationsStore } from "@/store/plantations";
import AnimatedCounter from "./animated-counter";

export default function LaborManagement() {
  const records = useLaborStore((state) => state.records);
  const addRecord = useLaborStore((state) => state.addRecord);
  const removeRecord = useLaborStore((state) => state.removeRecord);
  const getTotalLaborCost = useLaborStore((state) => state.getTotalLaborCost);
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<LaborRecord>>({
    role: "farmer",
    hours: 0,
    hourlyRate: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const totalCost = getTotalLaborCost();
  const monthlyCost = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return getTotalLaborCost(
      startOfMonth.toISOString().split("T")[0],
      endOfMonth.toISOString().split("T")[0]
    );
  }, [records, getTotalLaborCost]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || form.hours === undefined || form.hourlyRate === undefined) {
      return;
    }
    addRecord({
      name: form.name,
      role: form.role ?? "farmer",
      plantationId: form.plantationId,
      taskId: form.taskId,
      date: form.date || new Date().toISOString().split("T")[0],
      hours: form.hours ?? 0,
      hourlyRate: form.hourlyRate ?? 0,
      notes: form.notes,
    });
    setForm({
      role: "farmer",
      hours: 0,
      hourlyRate: 0,
      date: new Date().toISOString().split("T")[0],
    });
    setIsAdding(false);
  };

  const roles: LaborRole[] = [
    "farmer",
    "supervisor",
    "harvester",
    "maintenance",
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
          <h2 className="text-lg font-semibold text-white">Labor management</h2>
          <p className="text-sm text-slate-300/80">
            Track labor hours, costs, and worker assignments.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add labor record"}
        </button>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">
            Total labor cost
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-300">
            $<AnimatedCounter value={totalCost} />
          </p>
        </div>
        <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300/70">
            This month
          </p>
          <p className="mt-2 text-2xl font-bold text-purple-300">
            $<AnimatedCounter value={monthlyCost} />
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
              Worker name
              <input
                type="text"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Role
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as LaborRole })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
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
              Hours
              <input
                type="number"
                step="0.5"
                value={form.hours || 0}
                onChange={(e) =>
                  setForm({ ...form, hours: Number(e.target.value) })
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Hourly rate ($)
              <input
                type="number"
                step="0.01"
                value={form.hourlyRate || 0}
                onChange={(e) =>
                  setForm({ ...form, hourlyRate: Number(e.target.value) })
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Plantation (optional)
              <select
                value={form.plantationId || ""}
                onChange={(e) =>
                  setForm({ ...form, plantationId: e.target.value || undefined })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                <option value="">None</option>
                {plantations.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.seedName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Add labor record
          </button>
        </motion.form>
      )}

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">
          Recent labor records
        </h3>
        {recentRecords.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No labor records yet. Add your first record to get started.
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
                      <span className="text-sm font-semibold text-white">
                        {record.name}
                      </span>
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                        {record.role}
                      </span>
                      {plantation && (
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                          {plantation.seedName}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                      <span>{record.hours}h @ ${record.hourlyRate}/hr</span>
                      <span className="font-semibold text-white">
                        Total: ${record.totalCost.toLocaleString()}
                      </span>
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

