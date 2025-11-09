"use client";

import { useState, FormEvent, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useResourceStore,
  type ResourceAllocation,
  type ResourceType,
} from "@/store/resources";
import { usePlantationsStore } from "@/store/plantations";
import AnimatedCounter from "./animated-counter";

export default function ResourceAllocation() {
  const allocations = useResourceStore((state) => state.allocations);
  const addAllocation = useResourceStore((state) => state.addAllocation);
  const removeAllocation = useResourceStore((state) => state.removeAllocation);
  const getTotalCost = useResourceStore((state) => state.getTotalCost);
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<ResourceAllocation>>({
    type: "labor",
    startDate: new Date().toISOString().split("T")[0],
  });

  const totalCost = getTotalCost();
  const monthlyCost = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return getTotalCost(
      startOfMonth.toISOString().split("T")[0],
      endOfMonth.toISOString().split("T")[0]
    );
  }, [allocations, getTotalCost]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.plantationId || !form.name) {
      return;
    }
    addAllocation({
      type: form.type ?? "labor",
      name: form.name,
      plantationId: form.plantationId,
      taskId: form.taskId,
      startDate: form.startDate || new Date().toISOString().split("T")[0],
      endDate: form.endDate,
      hours: form.hours,
      cost: form.cost,
      notes: form.notes,
    });
    setForm({
      type: "labor",
      startDate: new Date().toISOString().split("T")[0],
    });
    setIsAdding(false);
  };

  const types: ResourceType[] = ["labor", "equipment", "vehicle", "other"];

  const groupedByType = types.reduce(
    (acc, type) => {
      acc[type] = allocations.filter((alloc) => alloc.type === type);
      return acc;
    },
    {} as Record<ResourceType, ResourceAllocation[]>
  );

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
            Resource allocation
          </h2>
          <p className="text-sm text-slate-300/80">
            Track labor, equipment, and vehicle usage across plantations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Allocate resource"}
        </button>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">
            Total cost (all time)
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
              Resource name
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
                  setForm({ ...form, type: e.target.value as ResourceType })
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
              Start date
              <input
                type="date"
                value={form.startDate || ""}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Hours
              <input
                type="number"
                step="0.5"
                value={form.hours || ""}
                onChange={(e) =>
                  setForm({ ...form, hours: Number(e.target.value) || undefined })
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
            Allocate resource
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-4">
        {types.map((type) => {
          const typeAllocations = groupedByType[type];
          if (typeAllocations.length === 0) return null;

          const typeCost = typeAllocations.reduce(
            (sum, alloc) => sum + (alloc.cost || 0),
            0
          );

          return (
            <div
              key={type}
              className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  {type.charAt(0).toUpperCase() + type.slice(1)} (
                  {typeAllocations.length})
                </h3>
                <span className="text-xs text-slate-300/70">
                  ${typeCost.toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                {typeAllocations.map((alloc) => {
                  const plantation = plantations.find(
                    (p) => p.id === alloc.plantationId
                  );
                  return (
                    <div
                      key={alloc.id}
                      className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-950/60 p-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          {alloc.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                          {plantation && (
                            <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                              {plantation.seedName}
                            </span>
                          )}
                          <span>
                            {new Date(alloc.startDate).toLocaleDateString()}
                          </span>
                          {alloc.hours && <span>{alloc.hours}h</span>}
                          {alloc.cost && (
                            <span className="font-semibold">
                              ${alloc.cost.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAllocation(alloc.id)}
                        className="ml-2 rounded-full bg-slate-800/70 p-2 text-slate-200/90 transition hover:bg-slate-700/80"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {allocations.length === 0 && (
        <div className="mt-6 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
          <p className="text-sm text-slate-300/80">
            No resource allocations yet. Add your first allocation to get started.
          </p>
        </div>
      )}
    </motion.section>
  );
}

