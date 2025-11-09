"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useInventoryStore } from "@/store/inventory";
import AnimatedCounter from "./animated-counter";

export default function InventoryAlerts() {
  const items = useInventoryStore((state) => state.items);
  const getLowStockItems = useInventoryStore((state) => state.getLowStockItems);

  const lowStockItems = useMemo(() => getLowStockItems(), [getLowStockItems]);
  const totalItems = items.length;
  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-rose-50/80 to-pink-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cocoa-900">
          Inventory Alerts
        </h2>
        <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
          Stock monitoring
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-rose-200 bg-white/80 p-3">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-600/70">
            Total items
          </p>
          <p className="mt-1 text-xl font-bold text-rose-700">
            <AnimatedCounter value={totalItems} />
          </p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-white/80 p-3">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-600/70">
            Total value
          </p>
          <p className="mt-1 text-xl font-bold text-rose-700">
            $<AnimatedCounter value={totalValue} />
          </p>
        </div>
      </div>

      {lowStockItems.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-rose-700">
            ⚠️ {lowStockItems.length} item(s) need restocking
          </p>
          {lowStockItems.slice(0, 5).map((item) => {
            const stockPercentage = (item.quantity / item.reorderPoint) * 100;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-rose-200 bg-white/80 p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-cocoa-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-cocoa-600">
                      {item.quantity} / {item.reorderPoint} units
                    </p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-rose-100">
                      <div
                        className="h-full bg-rose-500 transition-all"
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-2 rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                    Low
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-rose-200 bg-white/80 p-6 text-center">
          <span className="text-4xl">✅</span>
          <p className="mt-2 text-sm text-cocoa-600">
            All inventory items are well stocked
          </p>
        </div>
      )}
    </motion.section>
  );
}

