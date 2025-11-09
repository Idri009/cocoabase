"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type {
  AnalyticsSnapshot,
  WalletPerformanceSummary,
} from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { useWalletStore } from "@/store/wallets";

type WalletPerformancePanelProps = {
  snapshot: AnalyticsSnapshot;
};

type ExtendedWalletPerformance = WalletPerformanceSummary & {
  label?: string;
  isConnected: boolean;
  completionRate: number;
  totalTasks: number;
};

const stageOrder: Array<{ key: keyof WalletPerformanceSummary["stageCounts"]; label: string; tone: string }> =
  [
    { key: "planted", label: "Planted", tone: "text-leaf-700 bg-leaf-100/70" },
    { key: "growing", label: "Growing", tone: "text-gold-700 bg-gold-100/60" },
    { key: "harvested", label: "Harvested", tone: "text-amber-800 bg-amber-100/70" },
  ];

const WalletPerformancePanelBase = ({
  snapshot,
}: WalletPerformancePanelProps) => {
  const watchlist = useWalletStore((state) => state.watchlist);
  const connectedWallet = useWalletStore((state) => state.connectedWallet);

  const monthlyLabels = snapshot.monthlyPoints.map((point) => point.label);

  const wallets = useMemo(() => {
    const labelIndex = new Map<
      string,
      { address: string; label?: string }
    >();

    watchlist.forEach((wallet) => {
      labelIndex.set(wallet.address.toLowerCase(), {
        address: wallet.address,
        label: wallet.label,
      });
    });

    if (connectedWallet) {
      const key = connectedWallet.toLowerCase();
      if (!labelIndex.has(key)) {
        labelIndex.set(key, {
          address: connectedWallet,
          label: "Connected wallet",
        });
      }
    }

    const mapped = snapshot.walletPerformance.map<ExtendedWalletPerformance>(
      (wallet) => {
        const lower = wallet.address.toLowerCase();
        const labelInfo = labelIndex.get(lower);
        const totalTasks = wallet.activeTasks + wallet.completedTasks;
        const completionRate =
          totalTasks > 0 ? wallet.completedTasks / totalTasks : 0;

        return {
          ...wallet,
          label: labelInfo?.label,
          isConnected:
            connectedWallet?.toLowerCase() === lower,
          completionRate,
          totalTasks,
        };
      }
    );

    // Include watchlist wallets that do not yet have plantations
    labelIndex.forEach((info, lower) => {
      const exists = mapped.some(
        (wallet) => wallet.address.toLowerCase() === lower
      );

      if (!exists && info.address) {
        mapped.push({
          address: info.address,
          totalPlantations: 0,
          stageCounts: {
            planted: 0,
            growing: 0,
            harvested: 0,
          },
          activeTasks: 0,
          completedTasks: 0,
          carbonOffsetTons: 0,
          treeCount: 0,
          areaHectares: 0,
          avgYieldKg: null,
          forecastKg: null,
          harvestTrend: monthlyLabels.map((label) => ({
            label,
            harvested: 0,
          })),
          lastUpdated: undefined,
          label: info.label,
          isConnected: connectedWallet?.toLowerCase() === lower,
          completionRate: 0,
          totalTasks: 0,
        });
      }
    });

    return mapped.sort((a, b) => b.totalPlantations - a.totalPlantations);
  }, [snapshot.walletPerformance, snapshot.monthlyPoints, watchlist, connectedWallet]);

  if (!wallets.length) {
    return null;
  }

  const maxCarbon = wallets.reduce(
    (acc, wallet) => Math.max(acc, wallet.carbonOffsetTons),
    0
  );
  const maxHarvest = wallets.reduce((acc, wallet) => {
    const walletPeak = wallet.harvestTrend.reduce(
      (inner, point) => Math.max(inner, point.harvested),
      0
    );
    return Math.max(acc, walletPeak);
  }, 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cream-200 bg-white/85 p-6 shadow-sm shadow-cocoa-900/5 backdrop-blur"
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-cocoa-900">
            Wallet Performance Report
          </h2>
          <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
            Comparative wallet KPIs, carbon impact & velocity
          </p>
        </div>
        {connectedWallet && (
          <span className="text-xs text-cocoa-500">
            Connected:{" "}
            <span className="font-semibold text-cocoa-800">
              {connectedWallet.slice(0, 6)}…{connectedWallet.slice(-4)}
            </span>
          </span>
        )}
      </header>

      <div className="mt-5 overflow-hidden rounded-3xl border border-cream-200">
        <table className="min-w-full divide-y divide-cream-200 text-sm text-cocoa-700">
          <thead className="bg-cream-100/70 text-xs uppercase tracking-[0.2em] text-cocoa-500">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Wallet</th>
              <th className="px-4 py-3 text-left font-semibold">Plantations</th>
              <th className="px-4 py-3 text-left font-semibold">Tasks</th>
              <th className="px-4 py-3 text-left font-semibold">Carbon</th>
              <th className="px-4 py-3 text-left font-semibold">Avg Yield</th>
              <th className="px-4 py-3 text-left font-semibold">Forecast</th>
              <th className="px-4 py-3 text-left font-semibold">Harvest Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {wallets.map((wallet) => {
              const summary = stageOrder
                .map((item) => ({
                  key: item.key,
                  label: item.label,
                  tone: item.tone,
                  value: wallet.stageCounts[item.key],
                }))
                .filter((stage) => stage.value > 0);

              const carbonRatio =
                maxCarbon > 0 ? wallet.carbonOffsetTons / maxCarbon : 0;

              const harvestPeak = wallet.harvestTrend.reduce(
                (inner, point) => Math.max(inner, point.harvested),
                0
              );
              const harvestBaseline =
                maxHarvest > 0 ? maxHarvest : harvestPeak || 1;

              return (
                <tr
                  key={wallet.address}
                  className={cn(
                    "transition hover:bg-cream-50/80",
                    wallet.isConnected && "bg-leaf-50/70"
                  )}
                >
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-cocoa-900">
                        {wallet.label ?? "Community wallet"}
                      </span>
                      <span className="text-xs text-cocoa-400">
                        {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
                      </span>
                      {wallet.lastUpdated ? (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-cocoa-400">
                          Updated {new Date(wallet.lastUpdated).toLocaleString()}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-2">
                      <span className="text-lg font-semibold text-cocoa-900">
                        {wallet.totalPlantations}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {summary.length === 0 ? (
                          <span className="rounded-full bg-cream-100 px-2 py-0.5 text-[11px] text-cocoa-500">
                            No plantations yet
                          </span>
                        ) : (
                          summary.map((stage) => (
                            <span
                              key={stage.key}
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                                stage.tone
                              )}
                            >
                              {stage.value} {stage.label}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs text-cocoa-500">
                        <span>Completion</span>
                        <span className="font-semibold text-cocoa-900">
                          {Math.round(wallet.completionRate * 100)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-cream-200">
                        <div
                          className="h-2 rounded-full bg-leaf-500"
                          style={{
                            width: `${
                              wallet.completionRate > 0
                                ? Math.max(wallet.completionRate * 100, 6)
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-cocoa-500">
                        {wallet.completedTasks}/{wallet.totalTasks} tasks complete
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-2">
                      <span className="text-lg font-semibold text-cocoa-900">
                        {wallet.carbonOffsetTons.toLocaleString()} t
                      </span>
                      <div className="h-2 rounded-full bg-cream-200">
                        <div
                          className="h-2 rounded-full bg-cocoa-900"
                          style={{
                            width: `${Math.max(carbonRatio * 100, 6)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-cocoa-500">
                        {wallet.treeCount.toLocaleString()} trees •{" "}
                        {wallet.areaHectares.toLocaleString()} ha
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-semibold text-cocoa-900">
                        {wallet.avgYieldKg
                          ? `${wallet.avgYieldKg.toLocaleString()} kg`
                          : "—"}
                      </span>
                      <span className="text-xs text-cocoa-500">
                        Avg yield per plantation
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-semibold text-cocoa-900">
                        {wallet.forecastKg
                          ? `${wallet.forecastKg.toLocaleString()} kg`
                          : "—"}
                      </span>
                      <span className="text-xs text-cocoa-500">
                        Base scenario projection
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-end gap-1">
                      {wallet.harvestTrend.map((point) => {
                        const height =
                          harvestBaseline > 0
                            ? Math.max(
                                6,
                                (point.harvested / harvestBaseline) * 32
                              )
                            : 6;
                        return (
                          <div
                            key={`${wallet.address}-${point.label}`}
                            className="flex flex-col items-center gap-1"
                          >
                            <div
                              className="w-2 rounded-t-full bg-gradient-to-t from-leaf-500 via-leaf-400 to-leaf-300"
                              style={{ height }}
                              title={`${point.label}: ${point.harvested}`}
                            />
                            <span className="text-[10px] text-cocoa-400">
                              {point.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
};

const WalletPerformancePanel = memo(WalletPerformancePanelBase);

export default WalletPerformancePanel;


