"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useCertificationStore,
  type Certification,
  type CertificationType,
} from "@/store/certifications";
import { usePlantationsStore } from "@/store/plantations";

export default function CertificationManager() {
  const certifications = useCertificationStore((state) => state.certifications);
  const addCertification = useCertificationStore(
    (state) => state.addCertification
  );
  const removeCertification = useCertificationStore(
    (state) => state.removeCertification
  );
  const getExpiringSoon = useCertificationStore(
    (state) => state.getExpiringSoon
  );
  const plantations = usePlantationsStore((state) => state.plantations);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<Certification>>({
    type: "organic",
    status: "active",
  });

  const expiringSoon = getExpiringSoon(30);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.certificateNumber || !form.expiryDate) {
      return;
    }
    addCertification({
      type: form.type ?? "organic",
      name: form.name,
      issuer: form.issuer || "",
      certificateNumber: form.certificateNumber,
      issueDate: form.issueDate || new Date().toISOString().split("T")[0],
      expiryDate: form.expiryDate,
      status: form.status ?? "active",
      plantationId: form.plantationId,
      documentUrl: form.documentUrl,
      notes: form.notes,
    });
    setForm({
      type: "organic",
      status: "active",
    });
    setIsAdding(false);
  };

  const types: CertificationType[] = [
    "organic",
    "fair_trade",
    "rainforest_alliance",
    "utz",
    "iso",
    "other",
  ];

  const getStatusColor = (status: Certification["status"]) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "pending":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "expired":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "revoked":
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
            Certification manager
          </h2>
          <p className="text-sm text-slate-300/80">
            Track organic, fair trade, and other certifications.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add certification"}
        </button>
      </header>

      {expiringSoon.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
          <p className="text-sm font-semibold text-amber-300">
            ⚠️ {expiringSoon.length} certification(s) expiring within 30 days
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
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as CertificationType,
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
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Certificate number
              <input
                type="text"
                value={form.certificateNumber || ""}
                onChange={(e) =>
                  setForm({ ...form, certificateNumber: e.target.value })
                }
                required
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Issuer
              <input
                type="text"
                value={form.issuer || ""}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Issue date
              <input
                type="date"
                value={form.issueDate || ""}
                onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Expiry date
              <input
                type="date"
                value={form.expiryDate || ""}
                onChange={(e) =>
                  setForm({ ...form, expiryDate: e.target.value })
                }
                required
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
            Add certification
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-3">
        {certifications.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No certifications tracked yet. Add your first certification to get started.
            </p>
          </div>
        ) : (
          certifications.map((cert) => {
            const plantation = plantations.find(
              (p) => p.id === cert.plantationId
            );
            const isExpiringSoon =
              new Date(cert.expiryDate) <=
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            return (
              <div
                key={cert.id}
                className={cn(
                  "rounded-xl border p-4",
                  getStatusColor(cert.status)
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {cert.name}
                      </span>
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                        {cert.type.replace("_", " ")}
                      </span>
                      {isExpiringSoon && cert.status === "active" && (
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">
                          Expiring soon
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-300/70">
                      {cert.issuer} • #{cert.certificateNumber}
                    </p>
                    {plantation && (
                      <p className="mt-1 text-xs text-slate-300/70">
                        📍 {plantation.seedName}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400/70">
                      <span>
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      </span>
                      <span>
                        Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCertification(cert.id)}
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

