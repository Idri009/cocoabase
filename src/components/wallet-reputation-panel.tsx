"use client";

import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useWalletReputationStore } from "@/store/wallet-reputation";
import { usePlantationsStore } from "@/store/plantations";
import { useHelpRequestsStore } from "@/store/help-requests";
import { useFarmerChatStore } from "@/store/farmer-chat";
import { useAccount } from "wagmi";

export default function WalletReputationPanel() {
  const { address } = useAccount();
  const plantations = usePlantationsStore((state) => state.plantations);
  const helpRequests = useHelpRequestsStore((state) => state.requests);
  const chatMessages = useFarmerChatStore((state) => state.messages);

  const metrics = useWalletReputationStore((state) => state.metrics);
  const calculateAllReputations = useWalletReputationStore(
    (state) => state.calculateAllReputations
  );
  const getReputationForWallet = useWalletReputationStore(
    (state) => state.getReputationForWallet
  );
  const getTopWallets = useWalletReputationStore(
    (state) => state.getTopWallets
  );
  const getBadgesForWallet = useWalletReputationStore(
    (state) => state.getBadgesForWallet
  );

  useEffect(() => {
    calculateAllReputations(plantations, helpRequests, chatMessages);
  }, [plantations, helpRequests, chatMessages, calculateAllReputations]);

  const currentUserReputation = useMemo(() => {
    if (!address) {
      return null;
    }
    return getReputationForWallet(address);
  }, [address, metrics, getReputationForWallet]);

  const topWallets = useMemo(() => getTopWallets(10), [metrics, getTopWallets]);

  const currentUserBadges = useMemo(() => {
    if (!address) {
      return [];
    }
    return getBadgesForWallet(address);
  }, [address, metrics, getBadgesForWallet]);

  const formatWalletAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
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
            Wallet reputation scoreboard
          </h2>
          <p className="text-sm text-slate-300/80">
            Rankings based on plantation performance, community contributions,
            and sustainability impact.
          </p>
        </div>
        {currentUserReputation && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-leaf-500/20 px-3 py-1 text-xs font-semibold text-leaf-300">
              Your rank: {getRankEmoji(currentUserReputation.rank)}
            </span>
            <span className="rounded-full bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300/70">
              {currentUserReputation.score} pts
            </span>
          </div>
        )}
      </header>

      {currentUserReputation && (
        <div className="mt-6 rounded-2xl border border-leaf-400/40 bg-leaf-500/10 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-300 mb-3">
            Your reputation
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Score
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                {currentUserReputation.score}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Plantations
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                {currentUserReputation.plantationsCount}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Task completion
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                {currentUserReputation.taskCompletionRate}%
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Carbon offset
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                {currentUserReputation.carbonOffsetTons.toFixed(1)}t
              </p>
            </div>
          </div>
          {currentUserBadges.length > 0 && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70 mb-2">
                Badges
              </p>
              <div className="flex flex-wrap gap-2">
                {currentUserBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 rounded-full border border-leaf-400/40 bg-leaf-500/10 px-3 py-1.5"
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-leaf-200">
                        {badge.name}
                      </p>
                      <p className="text-[10px] text-slate-300/70">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300/70 mb-4">
          Top farmers
        </h3>
        {topWallets.length === 0 ? (
          <p className="text-sm text-slate-300/80">
            No reputation data available yet.
          </p>
        ) : (
          <div className="space-y-2">
            {topWallets.map((metric) => {
              const isCurrentUser = metric.walletAddress === address;
              const badges = getBadgesForWallet(metric.walletAddress);

              return (
                <div
                  key={metric.walletAddress}
                  className={cn(
                    "rounded-2xl border p-4",
                    isCurrentUser
                      ? "border-leaf-400/60 bg-leaf-500/10"
                      : "border-slate-700/40 bg-slate-900/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 text-lg font-bold text-white">
                        {getRankEmoji(metric.rank)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {formatWalletAddress(metric.walletAddress)}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-leaf-300">
                              (You)
                            </span>
                          )}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                          <span>{metric.plantationsCount} plantations</span>
                          <span>•</span>
                          <span>{metric.totalHarvests} harvests</span>
                          <span>•</span>
                          <span>{metric.taskCompletionRate}% tasks</span>
                          {badges.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                {badges.slice(0, 3).map((badge) => (
                                  <span key={badge.id}>{badge.icon}</span>
                                ))}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        {metric.score}
                      </p>
                      <p className="text-xs text-slate-400/70">points</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400/70">Carbon</p>
                      <p className="font-semibold text-white">
                        {metric.carbonOffsetTons.toFixed(1)}t
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400/70">Helped</p>
                      <p className="font-semibold text-white">
                        {metric.helpRequestsAnswered}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400/70">Requests</p>
                      <p className="font-semibold text-white">
                        {metric.helpRequestsCreated}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400/70">Messages</p>
                      <p className="font-semibold text-white">
                        {metric.chatMessagesCount}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}

