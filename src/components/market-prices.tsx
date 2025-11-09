"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import AnimatedCounter from "./animated-counter";

type MarketPrice = {
  commodity: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  lastUpdated: string;
};

const mockMarketPrices: MarketPrice[] = [
  {
    commodity: "Cocoa (NYMEX)",
    price: 3420,
    currency: "USD",
    change: 45,
    changePercent: 1.33,
    lastUpdated: new Date().toISOString(),
  },
  {
    commodity: "Cocoa (ICE)",
    price: 3380,
    currency: "USD",
    change: -12,
    changePercent: -0.35,
    lastUpdated: new Date().toISOString(),
  },
  {
    commodity: "Cocoa (Ghana)",
    price: 3200,
    currency: "USD",
    change: 28,
    changePercent: 0.88,
    lastUpdated: new Date().toISOString(),
  },
];

export default function MarketPrices() {
  const [prices, setPrices] = useState<MarketPrice[]>(mockMarketPrices);
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(
    null
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((price) => ({
          ...price,
          price: price.price + (Math.random() - 0.5) * 20,
          change: price.change + (Math.random() - 0.5) * 10,
          changePercent:
            ((price.price + (Math.random() - 0.5) * 20) / price.price - 1) *
            100,
          lastUpdated: new Date().toISOString(),
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cocoa-800/60 bg-[#101f3c]/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur"
    >
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Market prices</h2>
          <p className="text-sm text-slate-300/80">
            Real-time cocoa commodity prices from major exchanges.
          </p>
        </div>
        <span className="text-xs text-slate-400/70">
          Updates every 30s
        </span>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {prices.map((price) => (
          <div
            key={price.commodity}
            className={cn(
              "rounded-2xl border p-4 transition cursor-pointer",
              selectedCommodity === price.commodity
                ? "border-leaf-400/60 bg-leaf-500/10"
                : "border-slate-700/40 bg-slate-900/50 hover:border-slate-500/60"
            )}
            onClick={() =>
              setSelectedCommodity(
                selectedCommodity === price.commodity ? null : price.commodity
              )
            }
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
              {price.commodity}
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {price.currency}{" "}
              <AnimatedCounter value={Math.round(price.price)} />
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-semibold",
                  price.change >= 0 ? "text-emerald-300" : "text-rose-300"
                )}
              >
                {price.change >= 0 ? "↑" : "↓"} {Math.abs(price.change).toFixed(2)}
              </span>
              <span
                className={cn(
                  "text-xs",
                  price.changePercent >= 0
                    ? "text-emerald-300/70"
                    : "text-rose-300/70"
                )}
              >
                ({price.changePercent >= 0 ? "+" : ""}
                {price.changePercent.toFixed(2)}%)
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400/70">
              Updated: {new Date(price.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-white">
          Price trends (7 days)
        </h3>
        <div className="flex h-32 items-end justify-between gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const value = 60 + Math.random() * 40;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-leaf-500/60 to-leaf-400/40"
                style={{ height: `${value}%` }}
                title={`Day ${i + 1}: ${(value * 50).toFixed(0)}`}
              />
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-400/70">
          <span>7 days ago</span>
          <span>Today</span>
        </div>
      </div>
    </motion.section>
  );
}

