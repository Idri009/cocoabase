"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useEquipmentStore,
  type Equipment,
  type EquipmentDraft,
} from "@/store/equipment";
import { usePlantationsStore } from "@/store/plantations";

export default function EquipmentTracker() {
  const equipment = useEquipmentStore((state) => state.equipment);
  const addEquipment = useEquipmentStore((state) => state.addEquipment);
  const updateEquipment = useEquipmentStore((state) => state.updateEquipment);
  const removeEquipment = useEquipmentStore((state) => state.removeEquipment);
  const getEquipmentDueForMaintenance =
    useEquipmentStore((state) => state.getEquipmentDueForMaintenance);
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<EquipmentDraft>>({
    name: "",
    type: "",
    status: "operational",
  });

  const dueForMaintenance = getEquipmentDueForMaintenance();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      return;
    }
    addEquipment({
      name: form.name,
      type: form.type || "",
      brand: form.brand,
      model: form.model,
      serialNumber: form.serialNumber,
      purchaseDate: form.purchaseDate,
      purchasePrice: form.purchasePrice,
      status: form.status ?? "operational",
      location: form.location,
      lastMaintenanceDate: form.lastMaintenanceDate,
      nextMaintenanceDate: form.nextMaintenanceDate,
      maintenanceNotes: form.maintenanceNotes,
      plantationId: form.plantationId,
      notes: form.notes,
    });
    setForm({
      name: "",
      type: "",
      status: "operational",
    });
    setIsAdding(false);
  };

  const statuses: Equipment["status"][] = [
    "operational",
    "maintenance",
    "retired",
  ];

  const groupedByStatus = statuses.reduce(
    (acc, status) => {
      acc[status] = equipment.filter((item) => item.status === status);
      return acc;
    },
    {} as Record<Equipment["status"], Equipment[]>
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
            Equipment tracker
          </h2>
          <p className="text-sm text-slate-300/80">
            Track farm equipment and maintenance schedules.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add equipment"}
        </button>
      </header>

      {dueForMaintenance.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
          <p className="text-sm font-semibold text-amber-300">
            ⚠️ {dueForMaintenance.length} equipment item(s) due for maintenance
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
              Name
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
              <input
                type="text"
                value={form.type || ""}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="e.g. Tractor, Harvester"
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Brand
              <input
                type="text"
                value={form.brand || ""}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Model
              <input
                type="text"
                value={form.model || ""}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
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
                    status: e.target.value as Equipment["status"],
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Next maintenance
              <input
                type="date"
                value={form.nextMaintenanceDate || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nextMaintenanceDate: e.target.value || undefined,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Location
              <input
                type="text"
                value={form.location || ""}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
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
            Add equipment
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-4">
        {statuses.map((status) => {
          const statusItems = groupedByStatus[status];
          if (statusItems.length === 0) return null;

          return (
            <div
              key={status}
              className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4"
            >
              <h3 className="mb-3 text-sm font-semibold text-white">
                {status.charAt(0).toUpperCase() + status.slice(1)} (
                {statusItems.length})
              </h3>
              <div className="space-y-2">
                {statusItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-950/60 p-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {item.name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                        {item.type && <span>{item.type}</span>}
                        {item.brand && item.model && (
                          <span>
                            {item.brand} {item.model}
                          </span>
                        )}
                        {item.location && (
                          <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                            📍 {item.location}
                          </span>
                        )}
                        {item.nextMaintenanceDate && (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5",
                              new Date(item.nextMaintenanceDate) <= new Date()
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-slate-800/80"
                            )}
                          >
                            Maintenance:{" "}
                            {new Date(item.nextMaintenanceDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEquipment(item.id)}
                      className="ml-2 rounded-full bg-slate-800/70 p-2 text-slate-200/90 transition hover:bg-slate-700/80"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {equipment.length === 0 && (
        <div className="mt-6 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
          <p className="text-sm text-slate-300/80">
            No equipment tracked yet. Add your first equipment item to get started.
          </p>
        </div>
      )}
    </motion.section>
  );
}

