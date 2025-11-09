"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useComplianceStore,
  type ComplianceRecord,
  type ComplianceType,
  type ComplianceStatus,
} from "@/store/compliance";
import { usePlantationsStore } from "@/store/plantations";

export default function ComplianceTracker() {
  const records = useComplianceStore((state) => state.records);
  const addRecord = useComplianceStore((state) => state.addRecord);
  const updateRecord = useComplianceStore((state) => state.updateRecord);
  const removeRecord = useComplianceStore((state) => state.removeRecord);
  const getOverdueRecords = useComplianceStore(
    (state) => state.getOverdueRecords
  );
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<ComplianceRecord>>({
    type: "environmental",
    status: "pending",
  });

  const overdueRecords = getOverdueRecords();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.requirement) {
      return;
    }
    addRecord({
      type: form.type ?? "environmental",
      name: form.name,
      requirement: form.requirement,
      plantationId: form.plantationId,
      status: form.status ?? "pending",
      dueDate: form.dueDate,
      completedDate: form.completedDate,
      inspector: form.inspector,
      notes: form.notes,
    });
    setForm({
      type: "environmental",
      status: "pending",
    });
    setIsAdding(false);
  };

  const types: ComplianceType[] = [
    "environmental",
    "labor",
    "safety",
    "quality",
    "certification",
    "other",
  ];

  const statuses: ComplianceStatus[] = [
    "compliant",
    "non_compliant",
    "pending",
    "expired",
  ];

  const getStatusColor = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "non_compliant":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "pending":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "expired":
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
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
            Compliance tracker
          </h2>
          <p className="text-sm text-slate-300/80">
            Track regulatory compliance and requirements.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add requirement"}
        </button>
      </header>

      {overdueRecords.length > 0 && (
        <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3">
          <p className="text-sm font-semibold text-rose-300">
            ⚠️ {overdueRecords.length} compliance requirement(s) overdue
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
              Requirement name
              <input
                type="text"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    type: e.target.value as ComplianceType,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ").replace(/\b\w/g, (l) =>
                      l.toUpperCase()
                    )}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70 sm:col-span-2">
              Requirement description
              <textarea
                value={form.requirement || ""}
                onChange={(e) =>
                  setForm({ ...form, requirement: e.target.value })
                }
                required
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as ComplianceStatus,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ").replace(/\b\w/g, (l) =>
                      l.toUpperCase()
                    )}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Due date
              <input
                type="date"
                value={form.dueDate || ""}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value || undefined })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Add requirement
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-3">
        {records.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No compliance records yet. Add your first requirement to get started.
            </p>
          </div>
        ) : (
          records.map((record) => {
            const plantation = plantations.find(
              (p) => p.id === record.plantationId
            );
            const isOverdue =
              record.dueDate &&
              new Date(record.dueDate) < new Date() &&
              record.status !== "compliant";
            return (
              <div
                key={record.id}
                className={cn(
                  "rounded-xl border p-4",
                  getStatusColor(record.status),
                  isOverdue && "border-rose-500/60 bg-rose-500/20"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">
                        {record.name}
                      </h3>
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                        {record.type.replace("_", " ")}
                      </span>
                      {isOverdue && (
                        <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-300">
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-300/70">
                      {record.requirement}
                    </p>
                    {plantation && (
                      <p className="mt-1 text-xs text-slate-300/70">
                        📍 {plantation.seedName}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400/70">
                      {record.dueDate && (
                        <span>
                          Due: {new Date(record.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {record.inspector && (
                        <span>Inspector: {record.inspector}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.status === "pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateRecord(record.id, { status: "compliant" })
                        }
                        className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-200/90 transition hover:bg-slate-700/80"
                      >
                        Mark compliant
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

