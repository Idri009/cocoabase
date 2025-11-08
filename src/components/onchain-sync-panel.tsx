"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChainId } from "wagmi";
import { cn } from "@/lib/cn";

type Step = {
  id: string;
  label: string;
  description: string;
};

const steps: Step[] = [
  {
    id: "prepare",
    label: "Queued",
    description: "Transactions staged for simulation.",
  },
  {
    id: "signing",
    label: "Signing",
    description: "Generate deterministic signatures for minting seeds.",
  },
  {
    id: "broadcast",
    label: "Broadcast",
    description: "Relaying payloads to the network mempool.",
  },
  {
    id: "confirmed",
    label: "Confirmed",
    description: "State updates finalized on-chain.",
  },
];

const chainLabels: Record<number, string> = {
  1: "Ethereum Mainnet",
  42161: "Arbitrum One",
};

export default function OnchainSyncPanel() {
  const chainId = useChainId();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [status, setStatus] = useState<"idle" | "running" | "complete">("idle");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (status === "running" && activeIndex < steps.length - 1) {
      timer = setTimeout(() => {
        setActiveIndex((prev) => prev + 1);
      }, 1200);
    }
    if (status === "running" && activeIndex === steps.length - 1) {
      timer = setTimeout(() => setStatus("complete"), 900);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status, activeIndex]);

  const startSimulation = useCallback(() => {
    setActiveIndex(0);
    setStatus("running");
  }, []);

  const resetSimulation = useCallback(() => {
    setActiveIndex(-1);
    setStatus("idle");
  }, []);

  const networkLabel = useMemo(
    () => chainLabels[chainId] ?? `Chain ID ${chainId}`,
    [chainId]
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-cream-200 bg-gradient-to-br from-cocoa-900/95 via-cocoa-800 to-cocoa-800 text-cream-50 shadow-xl shadow-cocoa-900/40">
      <div className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full bg-leaf-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-0 h-40 w-40 rounded-full bg-gold-300/20 blur-2xl" />

      <div className="relative p-6">
        <header className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.35em] text-leaf-200/80">
            On-chain sync
          </span>
          <h2 className="text-xl font-semibold">Blockchain Preview</h2>
          <p className="text-sm text-cream-200/80">
            Simulate the end-to-end transaction flow before publishing your
            cocoa harvests on-chain.
          </p>
        </header>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-cream-200/70">
          <span className="rounded-full border border-leaf-400/40 bg-leaf-300/10 px-3 py-1 font-semibold uppercase tracking-wide text-leaf-100">
            {networkLabel}
          </span>
          <span className="rounded-full border border-cream-100/20 px-3 py-1 font-semibold uppercase tracking-wide text-cream-100/80">
            Mode: Prototype
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {steps.map((step, index) => {
            const isActive = index === activeIndex;
            const isComplete = index < activeIndex || status === "complete";
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm transition",
                  isActive && "border-leaf-300/60 bg-leaf-200/10",
                  isComplete && "border-leaf-400/60 bg-leaf-200/10"
                )}
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-leaf-200/40 bg-leaf-300/20 text-xs font-semibold text-cream-50">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-cream-100">
                        {step.label}
                      </p>
                      <p className="text-xs text-cream-200/70">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    {isActive && status === "running" ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-leaf-200"
                      >
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf-300 opacity-75" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-leaf-300" />
                        </span>
                        Streaming…
                      </motion.span>
                    ) : isComplete ? (
                      <motion.span
                        key="complete"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="rounded-full bg-leaf-400/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-leaf-200"
                      >
                        Confirmed
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={status === "running"}
            onClick={startSimulation}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-leaf-300 focus:ring-offset-2 focus:ring-offset-cocoa-800",
              status === "running"
                ? "cursor-not-allowed bg-cream-100/10 text-cream-100/60"
                : "bg-leaf-400 text-cocoa-900 shadow-lg shadow-leaf-400/40 hover:bg-leaf-300"
            )}
          >
            {status === "complete" ? "Run again" : "Simulate on-chain sync"}
          </motion.button>
          {status === "complete" && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetSimulation}
              className="rounded-full border border-cream-100/60 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-cream-200 transition hover:bg-cream-100/10 focus:outline-none focus:ring-2 focus:ring-cream-100/40 focus:ring-offset-2 focus:ring-offset-cocoa-900"
            >
              Reset
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
}

