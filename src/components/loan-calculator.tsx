"use client";

import { useState, FormEvent, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useLoanStore,
  type Loan,
  type LoanStatus,
} from "@/store/loans";
import { usePlantationsStore } from "@/store/plantations";
import AnimatedCounter from "./animated-counter";

export default function LoanCalculator() {
  const loans = useLoanStore((state) => state.loans);
  const addLoan = useLoanStore((state) => state.addLoan);
  const removeLoan = useLoanStore((state) => state.removeLoan);
  const calculateLoan = useLoanStore((state) => state.calculateLoan);
  const getActiveLoans = useLoanStore((state) => state.getActiveLoans);
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState(true);
  const [calcForm, setCalcForm] = useState({
    principal: 10000,
    interestRate: 5,
    termMonths: 12,
  });
  const [form, setForm] = useState<Partial<Loan>>({
    status: "active",
    interestRate: 5,
    termMonths: 12,
    startDate: new Date().toISOString().split("T")[0],
  });

  const calculation = useMemo(() => {
    return calculateLoan(
      calcForm.principal,
      calcForm.interestRate,
      calcForm.termMonths
    );
  }, [calcForm, calculateLoan]);

  const activeLoans = getActiveLoans();
  const totalMonthlyPayments = activeLoans.reduce(
    (sum, loan) => sum + loan.monthlyPayment,
    0
  );
  const totalOutstanding = activeLoans.reduce(
    (sum, loan) => sum + loan.principal,
    0
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.lender || !form.principal) {
      return;
    }
    addLoan({
      lender: form.lender,
      principal: form.principal,
      interestRate: form.interestRate ?? 5,
      termMonths: form.termMonths ?? 12,
      startDate: form.startDate || new Date().toISOString().split("T")[0],
      status: form.status ?? "active",
      plantationId: form.plantationId,
      purpose: form.purpose,
      notes: form.notes,
    });
    setForm({
      status: "active",
      interestRate: 5,
      termMonths: 12,
      startDate: new Date().toISOString().split("T")[0],
    });
    setIsAdding(false);
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
          <h2 className="text-lg font-semibold text-white">Loan calculator</h2>
          <p className="text-sm text-slate-300/80">
            Calculate loan payments and manage agricultural loans.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCalculatorMode(!calculatorMode)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              calculatorMode
                ? "bg-leaf-500/20 text-leaf-300 border border-leaf-400/40"
                : "bg-slate-800/80 text-slate-300/70 hover:bg-slate-700/80"
            )}
          >
            Calculator
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            {isAdding ? "Cancel" : "+ Add loan"}
          </button>
        </div>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">
            Total monthly payments
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-300">
            $<AnimatedCounter value={totalMonthlyPayments} />
          </p>
        </div>
        <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300/70">
            Total outstanding
          </p>
          <p className="mt-2 text-2xl font-bold text-purple-300">
            $<AnimatedCounter value={totalOutstanding} />
          </p>
        </div>
      </div>

      {calculatorMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 space-y-3 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4"
        >
          <h3 className="text-sm font-semibold text-white">Loan calculator</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Principal ($)
              <input
                type="number"
                value={calcForm.principal}
                onChange={(e) =>
                  setCalcForm({
                    ...calcForm,
                    principal: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Interest rate (%)
              <input
                type="number"
                step="0.1"
                value={calcForm.interestRate}
                onChange={(e) =>
                  setCalcForm({
                    ...calcForm,
                    interestRate: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Term (months)
              <input
                type="number"
                value={calcForm.termMonths}
                onChange={(e) =>
                  setCalcForm({
                    ...calcForm,
                    termMonths: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
          </div>
          <div className="grid gap-3 rounded-xl border border-slate-700/40 bg-slate-950/60 p-3 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Monthly payment
              </p>
              <p className="mt-1 text-lg font-bold text-emerald-300">
                ${calculation.monthlyPayment.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Total interest
              </p>
              <p className="mt-1 text-lg font-bold text-amber-300">
                ${calculation.totalInterest.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Total amount
              </p>
              <p className="mt-1 text-lg font-bold text-blue-300">
                ${calculation.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
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
              Lender
              <input
                type="text"
                value={form.lender || ""}
                onChange={(e) => setForm({ ...form, lender: e.target.value })}
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Principal ($)
              <input
                type="number"
                step="0.01"
                value={form.principal || 0}
                onChange={(e) =>
                  setForm({ ...form, principal: Number(e.target.value) })
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Interest rate (%)
              <input
                type="number"
                step="0.1"
                value={form.interestRate || 5}
                onChange={(e) =>
                  setForm({ ...form, interestRate: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Term (months)
              <input
                type="number"
                value={form.termMonths || 12}
                onChange={(e) =>
                  setForm({ ...form, termMonths: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Add loan
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-3">
        {loans.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No loans yet. Add your first loan to get started.
            </p>
          </div>
        ) : (
          loans.map((loan) => {
            const plantation = plantations.find(
              (p) => p.id === loan.plantationId
            );
            return (
              <div
                key={loan.id}
                className={cn(
                  "rounded-xl border p-4",
                  loan.status === "active"
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : loan.status === "paid_off"
                    ? "border-blue-500/40 bg-blue-500/10"
                    : "border-slate-500/40 bg-slate-500/10"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">
                        {loan.lender}
                      </h3>
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                        {loan.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                      <span>Principal: ${loan.principal.toLocaleString()}</span>
                      <span>Rate: {loan.interestRate}%</span>
                      <span>Term: {loan.termMonths} months</span>
                      <span className="font-semibold text-emerald-300">
                        Monthly: ${loan.monthlyPayment.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLoan(loan.id)}
                    className="ml-2 rounded-full bg-slate-800/70 p-2 text-slate-200/90 transition hover:bg-slate-700/80"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.section>
  );
}

