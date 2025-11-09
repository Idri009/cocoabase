"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useMaintenanceStore,
  type MaintenanceRecord,
  type MaintenanceType,
  type MaintenanceStatus,
} from "@/store/maintenance";
import { usePlantationsStore } from "@/store/plantations";

export default function MaintenanceScheduler() {
  const records = useMaintenanceStore((state) => state.records);
  const addRecord = useMaintenanceStore((state) => state.addRecord);
  const updateRecord = useMaintenanceStore((state) => state.updateRecord);
  const removeRecord = useMaintenanceStore((state) => state.removeRecord);
  const getOverdueRecords = useMaintenanceStore(
    (state) => state.getOverdueRecords
  );
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<MaintenanceRecord>>({
    type: "equipment",
    status: "scheduled",
    priority: "medium",
    scheduledDate: new Date().toISOString().split("T")[0],
  });

  const overdueRecords = getOverdueRecords();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.scheduledDate) {
      return;
    }
    addRecord({
      type: form.type ?? "equipment",
      title: form.title,
      description: form.description,
      equipmentId: form.equipmentId,
      plantationId: form.plantationId,
      scheduledDate: form.scheduledDate,
      completedDate: form.completedDate,
      cost: form.cost,
      technician: form.technician,
      status: form.status ?? "scheduled",
      priority: form.priority ?? "medium",
      notes: form.notes,
    });
    setForm({
      type: "equipment",
      status: "scheduled",
      priority: "medium",
      scheduledDate: new Date().toISOString().split("T")[0],
    });
    setIsAdding(false);
  };

  const types: MaintenanceType[] = [
    "equipment",
    "infrastructure",
    "irrigation",
    "other",
  ];

  const statuses: MaintenanceStatus[] = [
    "scheduled",
    "in_progress",
    "completed",
    "overdue",
  ];

  const priorities: MaintenanceRecord["priority"][] = [
    "low",
    "medium",
    "high",
    "urgent",
  ];

  const getPriorityColor = (priority: MaintenanceRecord["priority"]) => {
    switch (priority) {
      case "urgent":
        return "border-rose-500/60 bg-rose-500/20 text-rose-300";
      case "high":
        return "border-amber-500/60 bg-amber-500/20 text-amber-300";
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
            Maintenance scheduler
          </h2>
          <p className="text-sm text-slate-300/80">
            Schedule and track maintenance tasks for equipment and infrastructure.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Schedule maintenance"}
        </button>
      </header>

      {overdueRecords.length > 0 && (
        <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3">
          <p className="text-sm font-semibold text-rose-300">
            ⚠️ {overdueRecords.length} maintenance task(s) overdue
          </p>
        </div>
      )}

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
              Type
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as MaintenanceType,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
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
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Priority
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as MaintenanceRecord["priority"],
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Technician
              <input
                type="text"
                value={form.technician || ""}
                onChange={(e) =>
                  setForm({ ...form, technician: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Cost ($)
              <input
                type="number"
                step="0.01"
                value={form.cost || ""}
                onChange={(e) =>
                  setForm({ ...form, cost: Number(e.target.value) || undefined })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Schedule maintenance
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-3">
        {records.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No maintenance records yet. Schedule your first maintenance task to get started.
            </p>
          </div>
        ) : (
          records.map((record) => {
            const plantation = plantations.find(
              (p) => p.id === record.plantationId
            );
            const isOverdue =
              new Date(record.scheduledDate) < new Date() &&
              record.status !== "completed";
            return (
              <div
                key={record.id}
                className={cn(
                  "rounded-xl border p-4",
                  getPriorityColor(record.priority),
                  isOverdue && "border-rose-500/60 bg-rose-500/20"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">
                        {record.title}
                      </h3>
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                        {record.type}
                      </span>
                      {isOverdue && (
                        <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-300">
                          Overdue
                        </span>
                      )}
                    </div>
                    {record.description && (
                      <p className="mt-1 text-xs text-slate-300/70">
                        {record.description}
                      </p>
                    )}
                    {plantation && (
                      <p className="mt-1 text-xs text-slate-300/70">
                        📍 {plantation.seedName}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400/70">
                      <span>
                        Scheduled:{" "}
                        {new Date(record.scheduledDate).toLocaleDateString()}
                      </span>
                      {record.technician && (
                        <span>👤 {record.technician}</span>
                      )}
                      {record.cost && (
                        <span>💰 ${record.cost.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.status !== "completed" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateRecord(record.id, { status: "completed" })
                        }
                        className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-200/90 transition hover:bg-slate-700/80"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeRecord(record.id)}
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

