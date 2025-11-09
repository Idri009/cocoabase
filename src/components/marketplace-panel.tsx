"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { usePlantationsStore } from "@/store/plantations";

type MarketplaceListing = {
  id: string;
  type: "buy" | "sell";
  product: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  seller?: string;
  buyer?: string;
  status: "active" | "pending" | "completed";
  createdAt: string;
};

const mockListings: MarketplaceListing[] = [
  {
    id: "1",
    type: "sell",
    product: "Premium Cocoa Beans",
    quantity: 500,
    unit: "kg",
    price: 3.5,
    location: "Ashanti, Ghana",
    seller: "Golden Pod Estate",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    type: "buy",
    product: "Organic Fertilizer",
    quantity: 100,
    unit: "bags",
    price: 25,
    location: "Kumasi, Ghana",
    buyer: "Cocoa Farmers Co-op",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    type: "sell",
    product: "Cocoa Seedlings",
    quantity: 200,
    unit: "units",
    price: 2.0,
    location: "San José, Costa Rica",
    seller: "Tropical Seeds Co",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

export default function MarketplacePanel() {
  const plantations = usePlantationsStore((state) => state.plantations);
  const [listings] = useState<MarketplaceListing[]>(mockListings);
  const [filter, setFilter] = useState<"all" | "buy" | "sell">("all");

  const filteredListings =
    filter === "all"
      ? listings
      : listings.filter((l) => l.type === filter);

  const harvestedPlantations = plantations.filter(
    (p) => p.stage === "harvested"
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
          <h2 className="text-lg font-semibold text-white">Marketplace</h2>
          <p className="text-sm text-slate-300/80">
            Buy and sell agricultural products with other farmers.
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "buy", "sell"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                filter === f
                  ? "bg-leaf-500/20 text-leaf-300 border border-leaf-400/40"
                  : "bg-slate-800/80 text-slate-300/70 hover:bg-slate-700/80"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {harvestedPlantations.length > 0 && (
        <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
          <p className="text-sm font-semibold text-emerald-300">
            💡 You have {harvestedPlantations.length} harvested plantation(s)
            ready to sell
          </p>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {filteredListings.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No listings available. Check back later or create your own listing.
            </p>
          </div>
        ) : (
          filteredListings.map((listing) => (
            <div
              key={listing.id}
              className={cn(
                "rounded-xl border p-4",
                listing.type === "sell"
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-blue-500/40 bg-blue-500/10"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
                        listing.type === "sell"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-blue-500/20 text-blue-300"
                      )}
                    >
                      {listing.type}
                    </span>
                    <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                      {listing.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-white">
                    {listing.product}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                    <span>
                      {listing.quantity} {listing.unit}
                    </span>
                    <span className="font-semibold text-white">
                      ${listing.price}/{listing.unit}
                    </span>
                    <span>📍 {listing.location}</span>
                    {listing.seller && (
                      <span>👤 {listing.seller}</span>
                    )}
                    {listing.buyer && <span>👤 {listing.buyer}</span>}
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-2 rounded-full bg-leaf-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
                >
                  {listing.type === "sell" ? "Buy" : "Sell"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}

