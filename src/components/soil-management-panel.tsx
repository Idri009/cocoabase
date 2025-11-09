"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useSoilManagementStore,
  type SoilTest,
  type SoilTestType,
} from "@/store/soil-management";
import { usePlantationsStore } from "@/store/plantations";

export default function SoilManagementPanel() {
  const tests = useSoilManagementStore((state) => state.tests);
  const addTest = useSoilManagementStore((state) => state.addTest);
  const removeTest = useSoilManagementStore((state) => state.removeTest);
  const getLatestTest = useSoilManagementStore((state) => state.getLatestTest);
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<SoilTest>>({
    testType: "ph",
    testDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.plantationId) {
      return;
    }
    addTest({
      plantationId: form.plantationId,
      testType: form.testType ?? "ph",
      ph: form.ph,
      nitrogen: form.nitrogen,
      phosphorus: form.phosphorus,
      potassium: form.potassium,
      organicMatter: form.organicMatter,
      moisture: form.moisture,
      testDate: form.testDate || new Date().toISOString().split("T")[0],
      testedBy: form.testedBy,
      recommendations: form.recommendations,
      notes: form.notes,
    });
    setForm({
      testType: "ph",
      testDate: new Date().toISOString().split("T")[0],
    });
    setIsAdding(false);
  };

  const testTypes: SoilTestType[] = [
    "ph",
    "nutrients",
    "moisture",
    "organic_matter",
    "other",
  ];

  const recentTests = [...tests]
    .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())
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
          <h2 className="text-lg font-semibold text-white">Soil management</h2>
          <p className="text-sm text-slate-300/80">
            Track soil tests and nutrient levels for optimal crop health.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add soil test"}
        </button>
      </header>

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
              Test type
              <select
                value={form.testType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    testType: e.target.value as SoilTestType,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {testTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ").replace(/\b\w/g, (l) =>
                      l.toUpperCase()
                    )}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              pH level
              <input
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={form.ph || ""}
                onChange={(e) =>
                  setForm({ ...form, ph: Number(e.target.value) || undefined })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Nitrogen (ppm)
              <input
                type="number"
                step="0.1"
                value={form.nitrogen || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nitrogen: Number(e.target.value) || undefined,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Phosphorus (ppm)
              <input
                type="number"
                step="0.1"
                value={form.phosphorus || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phosphorus: Number(e.target.value) || undefined,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Potassium (ppm)
              <input
                type="number"
                step="0.1"
                value={form.potassium || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    potassium: Number(e.target.value) || undefined,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Test date
              <input
                type="date"
                value={form.testDate || ""}
                onChange={(e) => setForm({ ...form, testDate: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Add soil test
          </button>
        </motion.form>
      )}

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Recent tests</h3>
        {recentTests.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No soil tests yet. Add your first test to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTests.map((test) => {
              const plantation = plantations.find(
                (p) => p.id === test.plantationId
              );
              return (
                <div
                  key={test.id}
                  className="rounded-xl border border-slate-700/40 bg-slate-900/50 p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {plantation && (
                          <span className="text-sm font-semibold text-white">
                            {plantation.seedName}
                          </span>
                        )}
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                          {test.testType.replace("_", " ")}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300/70">
                        {test.ph !== undefined && (
                          <span>pH: {test.ph}</span>
                        )}
                        {test.nitrogen !== undefined && (
                          <span>N: {test.nitrogen} ppm</span>
                        )}
                        {test.phosphorus !== undefined && (
                          <span>P: {test.phosphorus} ppm</span>
                        )}
                        {test.potassium !== undefined && (
                          <span>K: {test.potassium} ppm</span>
                        )}
                        <span>
                          {new Date(test.testDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTest(test.id)}
                      className="ml-2 rounded-full bg-slate-800/70 p-2 text-slate-200/90 transition hover:bg-slate-700/80"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}

