"use client";

import { useState, FormEvent, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useBudgetStore,
  type Budget,
  type BudgetCategory,
} from "@/store/budget";
import { usePlantationsStore } from "@/store/plantations";
import AnimatedCounter from "./animated-counter";

export default function BudgetPlanner() {
  const budgets = useBudgetStore((state) => state.budgets);
  const addBudget = useBudgetStore((state) => state.addBudget);
  const removeBudget = useBudgetStore((state) => state.removeBudget);
  const getTotalAllocated = useBudgetStore((state) => state.getTotalAllocated);
  const getTotalSpent = useBudgetStore((state) => state.getTotalSpent);
  const getRemainingBudget = useBudgetStore(
    (state) => state.getRemainingBudget
  );
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<Budget>>({
    category: "seeds",
    currency: "USD",
    allocatedAmount: 0,
    period: {
      start: new Date().toISOString().split("T")[0],
      end: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString().split("T")[0],
    },
  });

  const totalAllocated = getTotalAllocated();
  const totalSpent = getTotalSpent();
  const remaining = getRemainingBudget();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || form.allocatedAmount === undefined) {
      return;
    }
    addBudget({
      name: form.name,
      category: form.category ?? "seeds",
      plantationId: form.plantationId,
      allocatedAmount: form.allocatedAmount ?? 0,
      period: form.period!,
      currency: form.currency ?? "USD",
      notes: form.notes,
    });
    setForm({
      category: "seeds",
      currency: "USD",
      allocatedAmount: 0,
      period: {
        start: new Date().toISOString().split("T")[0],
        end: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString().split("T")[0],
      },
    });
    setIsAdding(false);
  };

  const categories: BudgetCategory[] = [
    "seeds",
    "fertilizer",
    "equipment",
    "labor",
    "maintenance",
    "irrigation",
    "harvest",
    "transport",
    "other",
  ];

  const budgetsByCategory = useMemo(() => {
    return categories.reduce(
      (acc, cat) => {
        acc[cat] = budgets.filter((b) => b.category === cat);
        return acc;
      },
      {} as Record<BudgetCategory, Budget[]>
    );
  }, [budgets, categories]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cocoa-800/60 bg-[#101f3c]/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur"
    >
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Budget planner</h2>
          <p className="text-sm text-slate-300/80">
            Plan and track budgets for your operations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Create budget"}
        </button>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">
            Total allocated
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-300">
            $<AnimatedCounter value={totalAllocated} />
          </p>
        </div>
        <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300/70">
            Total spent
          </p>
          <p className="mt-2 text-2xl font-bold text-purple-300">
            $<AnimatedCounter value={totalSpent} />
          </p>
        </div>
        <div
          className={cn(
            "rounded-2xl border p-4",
            remaining >= 0
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-rose-500/40 bg-rose-500/10"
          )}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Remaining
          </p>
          <p
            className={cn(
              "mt-2 text-2xl font-bold",
              remaining >= 0 ? "text-emerald-300" : "text-rose-300"
            )}
          >
            $<AnimatedCounter value={remaining} />
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
              Budget name
              <input
                type="text"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Category
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as BudgetCategory,
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Allocated amount
              <input
                type="number"
                step="0.01"
                value={form.allocatedAmount || 0}
                onChange={(e) =>
                  setForm({
                    ...form,
                    allocatedAmount: Number(e.target.value),
                  })
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Currency
              <input
                type="text"
                value={form.currency || ""}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Start date
              <input
                type="date"
                value={form.period?.start || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    period: {
                      ...form.period!,
                      start: e.target.value,
                    },
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              End date
              <input
                type="date"
                value={form.period?.end || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    period: {
                      ...form.period!,
                      end: e.target.value,
                    },
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
            Create budget
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-4">
        {categories.map((category) => {
          const categoryBudgets = budgetsByCategory[category];
          if (categoryBudgets.length === 0) return null;

          const categoryTotal = categoryBudgets.reduce(
            (sum, b) => sum + b.allocatedAmount,
            0
          );
          const categorySpent = categoryBudgets.reduce(
            (sum, b) => sum + b.spentAmount,
            0
          );

          return (
            <div
              key={category}
              className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  {category.charAt(0).toUpperCase() + category.slice(1)} (
                  {categoryBudgets.length})
                </h3>
                <div className="text-right text-xs text-slate-300/70">
                  <p>
                    ${categorySpent.toLocaleString()} / $
                    {categoryTotal.toLocaleString()}
                  </p>
                  <p>
                    {((categorySpent / categoryTotal) * 100).toFixed(1)}% used
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {categoryBudgets.map((budget) => {
                  const percentage = (budget.spentAmount / budget.allocatedAmount) * 100;
                  return (
                    <div
                      key={budget.id}
                      className="rounded-xl border border-slate-700/40 bg-slate-950/60 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white">
                            {budget.name}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 rounded-full bg-slate-800/80 h-2 overflow-hidden">
                              <div
                                className={cn(
                                  "h-full transition-all",
                                  percentage >= 100
                                    ? "bg-rose-500"
                                    : percentage >= 80
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                )}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-300/70">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                            <span>
                              ${budget.spentAmount.toLocaleString()} / $
                              {budget.allocatedAmount.toLocaleString()}
                            </span>
                            <span>
                              {new Date(budget.period.start).toLocaleDateString()} -{" "}
                              {new Date(budget.period.end).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBudget(budget.id)}
                          className="ml-2 rounded-full bg-slate-800/70 p-2 text-slate-200/90 transition hover:bg-slate-700/80"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="mt-6 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
          <p className="text-sm text-slate-300/80">
            No budgets created yet. Create your first budget to get started.
          </p>
        </div>
      )}
    </motion.section>
  );
}

