"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

type Shortcut = {
  key: string;
  description: string;
  category: string;
};

const shortcuts: Shortcut[] = [
  {
    key: "⌘K / Ctrl+K",
    description: "Open global search",
    category: "Navigation",
  },
  {
    key: "⌘P / Ctrl+P",
    description: "Plant new seed",
    category: "Actions",
  },
  {
    key: "Esc",
    description: "Close modal/dialog",
    category: "Navigation",
  },
  {
    key: "/",
    description: "Focus search",
    category: "Navigation",
  },
  {
    key: "⌘E / Ctrl+E",
    description: "Export analytics",
    category: "Actions",
  },
  {
    key: "⌘? / Ctrl+?",
    description: "Show keyboard shortcuts",
    category: "Help",
  },
];

type KeyboardShortcutsProps = {
  onPlantSeed?: () => void;
  onExport?: () => void;
};

export default function KeyboardShortcuts({
  onPlantSeed,
  onExport,
}: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "?") {
        event.preventDefault();
        setIsOpen(true);
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "p") {
        event.preventDefault();
        onPlantSeed?.();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "e") {
        event.preventDefault();
        onExport?.();
      }
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onPlantSeed, onExport]);

  const shortcutsByCategory = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, Shortcut[]>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[10000] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2"
          >
            <div className="mx-4 rounded-2xl border border-slate-700/60 bg-[#101f3c] p-6 text-slate-100 shadow-2xl shadow-black/40">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Keyboard shortcuts
                </h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-200/90 transition hover:bg-slate-700/80"
                >
                  Close
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(shortcutsByCategory).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300/70">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {items.map((shortcut) => (
                        <div
                          key={shortcut.key}
                          className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-900/50 p-3"
                        >
                          <p className="text-sm text-slate-200">
                            {shortcut.description}
                          </p>
                          <kbd className="rounded bg-slate-800/80 px-3 py-1.5 font-mono text-xs font-semibold text-slate-300">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-slate-700/40 bg-slate-900/50 p-4">
                <p className="text-xs text-slate-300/80">
                  💡 Tip: Press <kbd className="rounded bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">⌘?</kbd> or{" "}
                  <kbd className="rounded bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-300">Ctrl+?</kbd> anytime to
                  see this help.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

