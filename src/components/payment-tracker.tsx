"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useEngagementStore } from "@/store/engagement";

export default function PaymentTracker() {
  const loans = useEngagementStore((state) => state.loans);
  const [selectedTab, setSelectedTab] = useState<"payments" | "loans">(
    "payments"
  );

  const payments = [
    {
      id: "1",
      type: "loan_payment",
      amount: 5000,
      currency: "USD",
      date: "2024-01-15",
      status: "completed",
      description: "Monthly loan payment",
    },
    {
      id: "2",
      type: "supplier",
      amount: 2500,
      currency: "USD",
      date: "2024-01-10",
      status: "pending",
      description: "Payment to AgriSupply Co.",
    },
    {
      id: "3",
      type: "equipment",
      amount: 15000,
      currency: "USD",
      date: "2024-01-05",
      status: "completed",
      description: "Irrigation system purchase",
    },
  ];

  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((acc, p) => acc + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-green-50/80 to-emerald-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cocoa-900">
          Payment Tracker
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
          Track payments and loans
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setSelectedTab("payments")}
          className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            selectedTab === "payments"
              ? "border-green-600 bg-green-600 text-white"
              : "border-cream-300 bg-white text-cocoa-700 hover:border-green-300"
          }`}
        >
          Payments
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab("loans")}
          className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            selectedTab === "loans"
              ? "border-green-600 bg-green-600 text-white"
              : "border-cream-300 bg-white text-cocoa-700 hover:border-green-300"
          }`}
        >
          Loans ({loans.length})
        </button>
      </div>

      {selectedTab === "payments" ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-green-200 bg-white/90 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-cocoa-400">
                Paid
              </div>
              <div className="mt-1 text-xl font-bold text-green-700">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "USD",
                }).format(totalPaid)}
              </div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-white/90 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-cocoa-400">
                Pending
              </div>
              <div className="mt-1 text-xl font-bold text-amber-700">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "USD",
                }).format(totalPending)}
              </div>
            </div>
          </div>
          {payments.map((payment) => (
            <div
              key={payment.id}
              className={`rounded-xl border p-3 ${
                payment.status === "completed"
                  ? "border-green-200 bg-white/80"
                  : "border-amber-200 bg-amber-50/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-cocoa-900">
                    {payment.description}
                  </p>
                  <p className="mt-1 text-xs text-cocoa-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cocoa-900">
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: payment.currency,
                    }).format(payment.amount)}
                  </div>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      payment.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {loans.length === 0 ? (
            <div className="rounded-xl border border-cream-200 bg-cream-50/70 p-6 text-center">
              <p className="text-sm text-cocoa-600">No active loans</p>
            </div>
          ) : (
            loans.map((loan) => (
              <div
                key={loan.id}
                className="rounded-xl border border-green-200 bg-white/80 p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-cocoa-900">
                      {loan.amount.toLocaleString()} {loan.currency}
                    </p>
                    <p className="mt-1 text-xs text-cocoa-500">
                      Status: {loan.status}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                    {loan.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </motion.section>
  );
}
