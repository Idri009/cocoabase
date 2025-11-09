"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useInventoryStore,
  type InventoryItem,
  type InventoryItemDraft,
} from "@/store/inventory";

export default function InventoryPanel() {
  const items = useInventoryStore((state) => state.items);
  const addItem = useInventoryStore((state) => state.addItem);
  const updateItem = useInventoryStore((state) => state.updateItem);
  const removeItem = useInventoryStore((state) => state.removeItem);
  const getLowStockItems = useInventoryStore((state) => state.getLowStockItems);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<InventoryItemDraft>>({
    name: "",
    category: "seeds",
    quantity: 0,
    unit: "kg",
    unitPrice: 0,
  });

  const lowStockItems = getLowStockItems(10);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || form.quantity === undefined) {
      return;
    }
    addItem({
      name: form.name,
      category: form.category ?? "seeds",
      quantity: form.quantity ?? 0,
      unit: form.unit ?? "kg",
      unitPrice: form.unitPrice ?? 0,
      supplier: form.supplier,
      purchaseDate: form.purchaseDate,
      expiryDate: form.expiryDate,
      location: form.location,
      notes: form.notes,
    });
    setForm({
      name: "",
      category: "seeds",
      quantity: 0,
      unit: "kg",
      unitPrice: 0,
    });
    setIsAdding(false);
  };

  const categories: InventoryItem["category"][] = [
    "seeds",
    "fertilizer",
    "equipment",
    "supplies",
    "other",
  ];

  const groupedItems = categories.reduce(
    (acc, cat) => {
      acc[cat] = items.filter((item) => item.category === cat);
      return acc;
    },
    {} as Record<InventoryItem["category"], InventoryItem[]>
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
          <h2 className="text-lg font-semibold text-white">Inventory</h2>
          <p className="text-sm text-slate-300/80">
            Track seeds, fertilizers, equipment, and supplies.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
        >
          {isAdding ? "Cancel" : "+ Add item"}
        </button>
      </header>

      {lowStockItems.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
          <p className="text-sm font-semibold text-amber-300">
            ⚠️ {lowStockItems.length} item(s) running low on stock
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
              Category
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as InventoryItem["category"],
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
              Quantity
              <input
                type="number"
                step="0.01"
                value={form.quantity || 0}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
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
                placeholder="kg, bags, pieces"
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Unit price
              <input
                type="number"
                step="0.01"
                value={form.unitPrice || 0}
                onChange={(e) =>
                  setForm({ ...form, unitPrice: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Supplier
              <input
                type="text"
                value={form.supplier || ""}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-leaf-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400"
          >
            Add to inventory
          </button>
        </motion.form>
      )}

      <div className="mt-6 space-y-4">
        {categories.map((category) => {
          const categoryItems = groupedItems[category];
          if (categoryItems.length === 0) return null;

          return (
            <div
              key={category}
              className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4"
            >
              <h3 className="mb-3 text-sm font-semibold text-white">
                {category.charAt(0).toUpperCase() + category.slice(1)} (
                {categoryItems.length})
              </h3>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-950/60 p-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {item.name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                        <span>
                          {item.quantity} {item.unit}
                        </span>
                        {item.unitPrice > 0 && (
                          <span>
                            @ {item.unitPrice.toLocaleString()}/{item.unit}
                          </span>
                        )}
                        {item.supplier && (
                          <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                            {item.supplier}
                          </span>
                        )}
                        {item.location && (
                          <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                            📍 {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-2 rounded-full bg-slate-800/70 p-2 text-slate-200/90 transition hover:bg-slate-700/80"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="mt-6 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
          <p className="text-sm text-slate-300/80">
            No inventory items yet. Add your first item to get started.
          </p>
        </div>
      )}
    </motion.section>
  );
}

