"use client";

import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";
import type { Plantation } from "./plantations";
import type { HelpRequest } from "./help-requests";
import type { ChatMessage } from "./farmer-chat";

export type ReputationMetric = {
  walletAddress: string;
  score: number;
  rank: number;
  plantationsCount: number;
  totalHarvests: number;
  taskCompletionRate: number;
  carbonOffsetTons: number;
  helpRequestsAnswered: number;
  helpRequestsCreated: number;
  chatMessagesCount: number;
  lastUpdated: string;
};

export type ReputationBadge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
};

const calculateReputationScore = (
  plantations: Plantation[],
  helpRequests: HelpRequest[],
  chatMessages: ChatMessage[],
  walletAddress: string
): Omit<ReputationMetric, "rank" | "lastUpdated"> => {
  const walletPlantations = plantations.filter(
    (p) => p.walletAddress === walletAddress
  );

  const harvestedCount = walletPlantations.filter(
    (p) => p.stage === "harvested"
  ).length;

  const totalTasks = walletPlantations.reduce(
    (sum, p) => sum + p.tasks.length,
    0
  );
  const completedTasks = walletPlantations.reduce(
    (sum, p) =>
      sum + p.tasks.filter((t) => t.status === "completed").length,
    0
  );
  const taskCompletionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const carbonOffsetTons = walletPlantations.reduce(
    (sum, p) => sum + p.carbonOffsetTons,
    0
  );

  const helpRequestsAnswered = helpRequests.filter((req) =>
    req.responses.some((r) => r.responderWalletAddress === walletAddress)
  ).length;

  const helpRequestsCreated = helpRequests.filter(
    (req) => req.walletAddress === walletAddress
  ).length;

  const chatMessagesCount = chatMessages.filter(
    (msg) => msg.senderWalletAddress === walletAddress
  ).length;

  let score = 0;
  score += walletPlantations.length * 10;
  score += harvestedCount * 50;
  score += Math.round(taskCompletionRate * 0.5);
  score += Math.round(carbonOffsetTons * 2);
  score += helpRequestsAnswered * 20;
  score += helpRequestsCreated * 5;
  score += Math.min(chatMessagesCount, 100) * 0.5;

  return {
    walletAddress,
    score: Math.round(score),
    plantationsCount: walletPlantations.length,
    totalHarvests: harvestedCount,
    taskCompletionRate: Math.round(taskCompletionRate * 10) / 10,
    carbonOffsetTons: Math.round(carbonOffsetTons * 10) / 10,
    helpRequestsAnswered,
    helpRequestsCreated,
    chatMessagesCount,
  };
};

type WalletReputationState = {
  metrics: ReputationMetric[];
  calculateAllReputations: (
    plantations: Plantation[],
    helpRequests: HelpRequest[],
    chatMessages: ChatMessage[]
  ) => void;
  getReputationForWallet: (
    walletAddress: string
  ) => ReputationMetric | undefined;
  getTopWallets: (limit?: number) => ReputationMetric[];
  getBadgesForWallet: (walletAddress: string) => ReputationBadge[];
};

const buildPersistOptions = (): PersistOptions<WalletReputationState> => {
  const options: PersistOptions<WalletReputationState> = {
    name: "cocoa-chain-wallet-reputation",
    version: 1,
    skipHydration: true,
    onRehydrateStorage: () => (state) => {
      if (!state) {
        return;
      }
      if (!state.metrics) {
        state.metrics = [];
      }
    },
  };

  if (typeof window !== "undefined") {
    options.storage = createJSONStorage(() => window.localStorage);
    options.skipHydration = false;
  }

  return options;
};

export const useWalletReputationStore = create<WalletReputationState>()(
  persist(
    (set, get) => ({
      metrics: [],
      calculateAllReputations: (plantations, helpRequests, chatMessages) => {
        const walletSet = new Set<string>();

        plantations.forEach((p) => walletSet.add(p.walletAddress));
        helpRequests.forEach((req) => {
          walletSet.add(req.walletAddress);
          req.responses.forEach((r) =>
            walletSet.add(r.responderWalletAddress)
          );
        });
        chatMessages.forEach((msg) => {
          walletSet.add(msg.senderWalletAddress);
          if (msg.recipientWalletAddress) {
            walletSet.add(msg.recipientWalletAddress);
          }
        });

        const metrics: ReputationMetric[] = Array.from(walletSet)
          .map((walletAddress) => {
            const base = calculateReputationScore(
              plantations,
              helpRequests,
              chatMessages,
              walletAddress
            );
            return {
              ...base,
              rank: 0,
              lastUpdated: new Date().toISOString(),
            };
          })
          .sort((a, b) => b.score - a.score)
          .map((metric, index) => ({
            ...metric,
            rank: index + 1,
          }));

        set({ metrics });
      },
      getReputationForWallet: (walletAddress) => {
        return get().metrics.find((m) => m.walletAddress === walletAddress);
      },
      getTopWallets: (limit = 10) => {
        return get().metrics.slice(0, limit);
      },
      getBadgesForWallet: (walletAddress) => {
        const metric = get().metrics.find(
          (m) => m.walletAddress === walletAddress
        );
        if (!metric) {
          return [];
        }

        const badges: ReputationBadge[] = [];

        if (metric.totalHarvests >= 10) {
          badges.push({
            id: "harvest-master",
            name: "Harvest Master",
            description: "Completed 10+ harvests",
            icon: "🌾",
          });
        }

        if (metric.taskCompletionRate >= 90) {
          badges.push({
            id: "task-perfectionist",
            name: "Task Perfectionist",
            description: "90%+ task completion rate",
            icon: "✅",
          });
        }

        if (metric.carbonOffsetTons >= 100) {
          badges.push({
            id: "carbon-champion",
            name: "Carbon Champion",
            description: "100+ tons carbon offset",
            icon: "🌳",
          });
        }

        if (metric.helpRequestsAnswered >= 5) {
          badges.push({
            id: "community-helper",
            name: "Community Helper",
            description: "Helped 5+ farmers",
            icon: "🤝",
          });
        }

        if (metric.chatMessagesCount >= 50) {
          badges.push({
            id: "social-butterfly",
            name: "Social Butterfly",
            description: "50+ chat messages",
            icon: "💬",
          });
        }

        if (metric.rank === 1) {
          badges.push({
            id: "top-farmer",
            name: "Top Farmer",
            description: "Ranked #1 in reputation",
            icon: "👑",
          });
        }

        return badges;
      },
    }),
    buildPersistOptions()
  )
);

