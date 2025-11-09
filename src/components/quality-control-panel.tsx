"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useQualityControlStore,
  type QualityTest,
  type QualityTestType,
  type QualityGrade,
} from "@/store/quality-control";
import { usePlantationsStore } from "@/store/plantations";

export default function QualityControlPanel() {
  const tests = useQualityControlStore((state) => state.tests);
  const addTest = useQualityControlStore((state) => state.addTest);
  const removeTest = useQualityControlStore((state) => state.removeTest);
  const getAverageGrade = useQualityControlStore((state) => state.getAverageGrade);
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<QualityTest>>({
    testType: "moisture",
    grade: "grade_a",
    result: 0,
    unit: "%",
    testDate: new Date().toISOString().split("T")[0],
  });

  const overallAverage = getAverageGrade();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.plantationId || form.result === undefined) {
      return;
    }
    addTest({
      plantationId: form.plantationId,
      harvestId: form.harvestId,
      testType: form.testType ?? "moisture",
      grade: form.grade ?? "grade_a",
      result: form.result ?? 0,
      unit: form.unit ?? "%",
      notes: form.notes,
      testedBy: form.testedBy,
      testDate: form.testDate || new Date().toISOString().split("T")[0],
    });
    setForm({
      testType: "moisture",
      grade: "grade_a",
      result: 0,
      unit: "%",
      testDate: new Date().toISOString().split("T")[0],
    });
    setIsAdding(false);
  };

  const testTypes: QualityTestType[] = [
    "moisture",
    "bean_count",
    "fermentation",
    "flavor",
    "defect",
    "other",
  ];

  const grades: QualityGrade[] = ["premium", "grade_a", "grade_b", "reject"];

  const getGradeColor = (grade: QualityGrade) => {
    switch (grade) {
      case "premium":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "grade_a":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "grade_b":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "reject":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
    }
  };

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
          <h2 className="text-lg font-semibold text-white">Quality control</h2>
          <p className="text-sm text-slate-300/80">
            Track quality tests and grading for your harvests.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add test"}
        </button>
      </header>

      {overallAverage && (
        <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
          <p className="text-sm font-semibold text-emerald-300">
            Overall average grade:{" "}
            <span className="uppercase">{overallAverage.replace("_", " ")}</span>
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
                    testType: e.target.value as QualityTestType,
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
              Grade
              <select
                value={form.grade}
                onChange={(e) =>
                  setForm({ ...form, grade: e.target.value as QualityGrade })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade.replace("_", " ").replace(/\b\w/g, (l) =>
                      l.toUpperCase()
                    )}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Result
              <input
                type="number"
                step="0.01"
                value={form.result || 0}
                onChange={(e) =>
                  setForm({ ...form, result: Number(e.target.value) })
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Unit
              <input
                type="text"
                value={form.unit || ""}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
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
            Add test
          </button>
        </motion.form>
      )}

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Recent tests</h3>
        {recentTests.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No quality tests yet. Add your first test to get started.
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
                  className={cn(
                    "rounded-xl border p-3",
                    getGradeColor(test.grade)
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase">
                          {test.grade.replace("_", " ")}
                        </span>
                        {plantation && (
                          <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                            {plantation.seedName}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {test.testType.replace("_", " ")}: {test.result}{" "}
                        {test.unit}
                      </p>
                      <p className="mt-1 text-xs text-slate-300/70">
                        {new Date(test.testDate).toLocaleDateString()}
                        {test.testedBy && ` • Tested by: ${test.testedBy}`}
                      </p>
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

