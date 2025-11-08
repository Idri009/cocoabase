"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Plantation } from "@/store/plantations";
import { cn } from "@/lib/cn";

type CommunitySharePanelProps = {
  plantations: Plantation[];
  activeWalletCount: number;
};

const emojiByStage: Record<string, string> = {
  planted: "🌱",
  growing: "🌿",
  harvested: "🌾",
};

const twitterShareUrl = (message: string) =>
  `https://x.com/intent/tweet?text=${encodeURIComponent(message)}`;

export default function CommunitySharePanel({
  plantations,
  activeWalletCount,
}: CommunitySharePanelProps) {
  const [copied, setCopied] = useState(false);

  const total = plantations.length;
  const harvested = plantations.filter(
    (plantation) => plantation.stage === "harvested"
  ).length;
  const fastest = plantations.reduce(
    (acc, plantation) =>
      plantation.stage === "harvested" &&
      (!acc ||
        new Date(plantation.updatedAt).getTime() -
          new Date(plantation.startDate).getTime() <
          new Date(acc.updatedAt).getTime() -
            new Date(acc.startDate).getTime())
        ? plantation
        : acc,
    null as Plantation | null
  );

  const shareMessage = `I’m nurturing ${total} cocoa seeds on Cocoa Chain with ${harvested} already harvested! 🌱🌿🌾 Join me on-chain → https://cocoachain.com`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-3xl border border-cream-200 bg-cream-50/80 p-5 shadow-sm shadow-cocoa-900/5 backdrop-blur">
      <header className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.3em] text-cocoa-400">
          Social bloom
        </span>
        <h2 className="text-lg font-semibold text-cocoa-900">
          Celebrate with the community
        </h2>
        <p className="text-xs text-cocoa-500">
          Generate a shareable update and invite growers into your cocoa circle.
        </p>
      </header>

      <div className="mt-5 rounded-2xl border border-dashed border-cream-300 bg-white/70 p-4 text-sm text-cocoa-700">
        <p>
          {shareMessage.split("🌱🌿🌾")[0]}
          <span className="ml-1 inline-flex gap-1 text-lg">
            {Object.entries(emojiByStage).map(([stage, emoji]) => (
              <span key={stage} title={stage}>
                {emoji}
              </span>
            ))}
          </span>
          Join me on-chain →{" "}
          <a
            href="https://cocoachain.com"
            className="font-semibold text-leaf-600 underline underline-offset-4"
          >
            cocoachain.com
          </a>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-cocoa-500">
        <span className="rounded-full bg-leaf-200/40 px-3 py-1 font-semibold uppercase tracking-wide text-leaf-700">
          {activeWalletCount} wallet
          {activeWalletCount === 1 ? "" : "s"} in spotlight
        </span>
        <span className="rounded-full bg-gold-200/40 px-3 py-1 font-semibold uppercase tracking-wide text-cocoa-700">
          {harvested} harvests ready
        </span>
      </div>

      {fastest && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-gradient-to-br from-leaf-200/60 via-cream-100 to-gold-100 p-4 text-sm text-cocoa-800 shadow-inner"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-cocoa-500">
            Fastest harvest
          </p>
          <p className="mt-1 text-sm font-semibold">
            {fastest.seedName} {emojiByStage[fastest.stage] ?? "🌱"}
          </p>
          <p className="text-xs text-cocoa-600">
            Harvested in{" "}
            {Math.max(
              0,
              Math.round(
                (new Date(fastest.updatedAt).getTime() -
                  new Date(fastest.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            )}{" "}
            days — share this win with your crew!
          </p>
        </motion.div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          href={twitterShareUrl(shareMessage)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-cocoa-900 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-cream-50 shadow-lg shadow-cocoa-900/30 transition hover:bg-cocoa-800 focus:outline-none focus:ring-2 focus:ring-cocoa-500 focus:ring-offset-2 focus:ring-offset-cream-50"
        >
          Share update on X
        </motion.a>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCopy}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-cocoa-200 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-cocoa-600 transition hover:border-cocoa-400 hover:text-cocoa-800 focus:outline-none focus:ring-2 focus:ring-leaf-300 focus:ring-offset-2 focus:ring-offset-cream-50",
            copied && "border-leaf-400 text-leaf-600"
          )}
        >
          {copied ? (
            <AnimatePresence mode="wait">
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
              >
                Copied!
              </motion.span>
            </AnimatePresence>
          ) : (
            "Copy message"
          )}
        </motion.button>
      </div>
    </section>
  );
}

