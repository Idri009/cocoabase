"use client";

import { useState, FormEvent, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  usePaymentsStore,
  type Payment,
  type PaymentType,
  type PaymentStatus,
} from "@/store/payments";
import { usePlantationsStore } from "@/store/plantations";
import AnimatedCounter from "./animated-counter";

export default function PaymentTracker() {
  const payments = usePaymentsStore((state) => state.payments);
  const addPayment = usePaymentsStore((state) => state.addPayment);
  const updatePayment = usePaymentsStore((state) => state.updatePayment);
  const removePayment = usePaymentsStore((state) => state.removePayment);
  const getPendingPayments = usePaymentsStore(
    (state) => state.getPendingPayments
  );
  const getTotalByType = usePaymentsStore((state) => state.getTotalByType);
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<Payment>>({
    type: "expense",
    method: "cash",
    status: "pending",
    currency: "USD",
  });

  const pendingPayments = getPendingPayments();
  const totalIncome = getTotalByType("income");
  const totalExpenses = getTotalByType("expense");
  const netAmount = totalIncome - totalExpenses;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description) {
      return;
    }
    addPayment({
      type: form.type ?? "expense",
      amount: form.amount,
      currency: form.currency || "USD",
      method: form.method ?? "cash",
      status: form.status ?? "pending",
      description: form.description,
      recipient: form.recipient,
      payer: form.payer,
      dueDate: form.dueDate,
      paidDate: form.paidDate,
      invoiceNumber: form.invoiceNumber,
      reference: form.reference,
      plantationId: form.plantationId,
      contractId: form.contractId,
      notes: form.notes,
    });
    setForm({
      type: "expense",
      method: "cash",
      status: "pending",
      currency: "USD",
    });
    setIsAdding(false);
  };

  const types: PaymentType[] = ["income", "expense", "refund"];
  const methods: Payment["method"][] = [
    "cash",
    "bank_transfer",
    "check",
    "crypto",
    "other",
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cocoa-800/60 bg-[#101f3c]/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur"
    >
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Payment tracker</h2>
          <p className="text-sm text-slate-300/80">
            Track payments, invoices, and financial transactions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add payment"}
        </button>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">
            Total income
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">
            $<AnimatedCounter value={totalIncome} />
          </p>
        </div>
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-300/70">
            Total expenses
          </p>
          <p className="mt-2 text-2xl font-bold text-rose-300">
            $<AnimatedCounter value={totalExpenses} />
          </p>
        </div>
        <div
          className={cn(
            "rounded-2xl border p-4",
            netAmount >= 0
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-rose-500/40 bg-rose-500/10"
          )}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Net amount
          </p>
          <p
            className={cn(
              "mt-2 text-2xl font-bold",
              netAmount >= 0 ? "text-emerald-300" : "text-rose-300"
            )}
          >
            $<AnimatedCounter value={netAmount} />
          </p>
        </div>
      </div>

      {pendingPayments.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
          <p className="text-sm font-semibold text-amber-300">
            ⚠️ {pendingPayments.length} pending payment(s)
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
              Type
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as PaymentType })
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
              Amount
              <input
                type="number"
                step="0.01"
                value={form.amount || ""}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Description
              <input
                type="text"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Payment method
              <select
                value={form.method}
                onChange={(e) =>
                  setForm({
                    ...form,
                    method: e.target.value as Payment["method"],
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                {methods.map((method) => (
                  <option key={method} value={method}>
                    {method.replace("_", " ").replace(/\b\w/g, (l) =>
                      l.toUpperCase()
                    )}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Add payment
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-2">
        {payments.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No payments yet. Add your first payment to get started.
            </p>
          </div>
        ) : (
          payments.slice(0, 10).map((payment) => {
            const plantation = plantations.find(
              (p) => p.id === payment.plantationId
            );
            return (
              <div
                key={payment.id}
                className={cn(
                  "rounded-xl border p-3",
                  payment.type === "income"
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-rose-500/40 bg-rose-500/10"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {payment.description}
                      </span>
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                        {payment.status}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                      <span className="font-semibold">
                        {payment.type === "income" ? "+" : "-"}
                        {payment.currency} {payment.amount.toLocaleString()}
                      </span>
                      <span>{payment.method.replace("_", " ")}</span>
                      {payment.dueDate && (
                        <span>
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {payment.status === "pending" && (
                    <button
                      type="button"
                      onClick={() =>
                        updatePayment(payment.id, { status: "completed" })
                      }
                      className="ml-2 rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-200/90 transition hover:bg-slate-700/80"
                    >
                      Mark paid
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removePayment(payment.id)}
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

