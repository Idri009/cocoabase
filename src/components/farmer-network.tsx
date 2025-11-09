"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useFarmerNetworkStore,
  type FarmerConnection,
  type ConnectionStatus,
} from "@/store/farmer-network";

export default function FarmerNetwork() {
  const connections = useFarmerNetworkStore((state) => state.connections);
  const addConnection = useFarmerNetworkStore((state) => state.addConnection);
  const updateConnection = useFarmerNetworkStore(
    (state) => state.updateConnection
  );
  const removeConnection = useFarmerNetworkStore(
    (state) => state.removeConnection
  );
  const getConnectedFarmers = useFarmerNetworkStore(
    (state) => state.getConnectedFarmers
  );
  const searchConnections = useFarmerNetworkStore(
    (state) => state.searchConnections
  );

  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState<Partial<FarmerConnection>>({
    status: "pending",
    specialties: [],
  });

  const connectedFarmers = getConnectedFarmers();
  const filteredConnections = searchQuery
    ? searchConnections(searchQuery)
    : connections;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.walletAddress) {
      return;
    }
    addConnection({
      walletAddress: form.walletAddress,
      name: form.name,
      bio: form.bio,
      location: form.location,
      specialties: form.specialties || [],
      status: form.status ?? "pending",
      notes: form.notes,
    });
    setForm({
      status: "pending",
      specialties: [],
    });
    setIsAdding(false);
  };

  const specialties = [
    "organic_farming",
    "sustainable_practices",
    "crop_rotation",
    "irrigation",
    "pest_management",
    "harvesting",
    "equipment_maintenance",
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
          <h2 className="text-lg font-semibold text-white">Farmer network</h2>
          <p className="text-sm text-slate-300/80">
            Connect with other farmers and build your agricultural network.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add connection"}
        </button>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">
            Total connections
          </p>
          <p className="mt-2 text-2xl font-bold text-blue-300">
            {connections.length}
          </p>
        </div>
        <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300/70">
            Connected farmers
          </p>
          <p className="mt-2 text-2xl font-bold text-purple-300">
            {connectedFarmers.length}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Search connections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-400/50 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
        />
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
              Wallet address
              <input
                type="text"
                value={form.walletAddress || ""}
                onChange={(e) =>
                  setForm({ ...form, walletAddress: e.target.value })
                }
                required
                placeholder="0x..."
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Name (optional)
              <input
                type="text"
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Location (optional)
              <input
                type="text"
                value={form.location || ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70 sm:col-span-2">
              Bio (optional)
              <textarea
                value={form.bio || ""}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Add connection
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-3">
        {filteredConnections.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              {searchQuery
                ? "No connections found matching your search."
                : "No connections yet. Add your first connection to get started."}
            </p>
          </div>
        ) : (
          filteredConnections.map((connection) => {
            const getStatusColor = (status: ConnectionStatus) => {
              switch (status) {
                case "connected":
                  return "border-emerald-500/40 bg-emerald-500/10";
                case "pending":
                  return "border-amber-500/40 bg-amber-500/10";
                case "blocked":
                  return "border-slate-500/40 bg-slate-500/10";
              }
            };

            return (
              <div
                key={connection.id}
                className={cn(
                  "rounded-xl border p-4",
                  getStatusColor(connection.status)
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">
                        {connection.name || "Unknown Farmer"}
                      </h3>
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                        {connection.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300/70 font-mono">
                      {connection.walletAddress.slice(0, 10)}...
                      {connection.walletAddress.slice(-8)}
                    </p>
                    {connection.location && (
                      <p className="mt-1 text-xs text-slate-300/70">
                        📍 {connection.location}
                      </p>
                    )}
                    {connection.bio && (
                      <p className="mt-1 text-xs text-slate-300/70">
                        {connection.bio}
                      </p>
                    )}
                    {connection.specialties && connection.specialties.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {connection.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70"
                          >
                            {spec.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {connection.status === "pending" && (
                      <button
                        type="button"
                        onClick={() =>
                          updateConnection(connection.id, {
                            status: "connected",
                          })
                        }
                        className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-200/90 transition hover:bg-slate-700/80"
                      >
                        Accept
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeConnection(connection.id)}
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

