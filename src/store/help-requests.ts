"use client";

import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type HelpRequestStatus = "open" | "in_progress" | "resolved" | "closed";
export type HelpRequestPriority = "low" | "medium" | "high" | "urgent";
export type HelpRequestCategory =
  | "pest_control"
  | "irrigation"
  | "fertilization"
  | "harvesting"
  | "equipment"
  | "financial"
  | "legal"
  | "other";

export type HelpRequestResponse = {
  id: string;
  responderWalletAddress: string;
  responderName?: string;
  message: string;
  createdAt: string;
  helpful?: boolean;
};

export type HelpRequest = {
  id: string;
  walletAddress: string;
  plantationId?: string;
  category: HelpRequestCategory;
  status: HelpRequestStatus;
  priority: HelpRequestPriority;
  title: string;
  description: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  responses: HelpRequestResponse[];
  attachments: string[];
  resolvedBy?: string;
  resolvedAt?: string;
};

export type HelpRequestDraft = Omit<
  HelpRequest,
  "id" | "status" | "createdAt" | "updatedAt" | "responses" | "attachments"
> & {
  status?: HelpRequestStatus;
  attachments?: string[];
};

export type HelpRequestResponseDraft = Omit<
  HelpRequestResponse,
  "id" | "createdAt"
>;

type HelpRequestsState = {
  requests: HelpRequest[];
  addRequest: (draft: HelpRequestDraft) => HelpRequest;
  updateRequestStatus: (
    id: string,
    status: HelpRequestStatus,
    resolvedBy?: string
  ) => void;
  addResponse: (requestId: string, response: HelpRequestResponseDraft) => void;
  markResponseHelpful: (requestId: string, responseId: string) => void;
  updateRequest: (
    id: string,
    updates: Partial<Pick<HelpRequest, "priority" | "description" | "title">>
  ) => void;
};

const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const withNow = () => new Date().toISOString();

const buildPersistOptions = (): PersistOptions<HelpRequestsState> => {
  const options: PersistOptions<HelpRequestsState> = {
    name: "cocoa-chain-help-requests",
    version: 1,
    skipHydration: true,
    onRehydrateStorage: () => (state) => {
      if (!state) {
        return;
      }
      if (!state.requests) {
        state.requests = [];
      }
    },
  };

  if (typeof window !== "undefined") {
    options.storage = createJSONStorage(() => window.localStorage);
    options.skipHydration = false;
  }

  return options;
};

export const useHelpRequestsStore = create<HelpRequestsState>()(
  persist(
    (set) => ({
      requests: [],
      addRequest: (draft) => {
        const now = withNow();
        const request: HelpRequest = {
          id: generateId("help"),
          status: draft.status ?? "open",
          createdAt: now,
          updatedAt: now,
          responses: [],
          attachments: draft.attachments ?? [],
          ...draft,
        };

        set((state) => ({
          requests: [request, ...state.requests],
        }));

        return request;
      },
      updateRequestStatus: (id, status, resolvedBy) => {
        const now = withNow();
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id
              ? {
                  ...request,
                  status,
                  updatedAt: now,
                  resolvedBy: status === "resolved" ? resolvedBy : undefined,
                  resolvedAt: status === "resolved" ? now : undefined,
                }
              : request
          ),
        }));
      },
      addResponse: (requestId, response) => {
        const now = withNow();
        const newResponse: HelpRequestResponse = {
          id: generateId("response"),
          createdAt: now,
          ...response,
        };

        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  responses: [...request.responses, newResponse],
                  updatedAt: now,
                }
              : request
          ),
        }));
      },
      markResponseHelpful: (requestId, responseId) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  responses: request.responses.map((response) =>
                    response.id === responseId
                      ? { ...response, helpful: true }
                      : response
                  ),
                }
              : request
          ),
        }));
      },
      updateRequest: (id, updates) => {
        const now = withNow();
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === id
              ? { ...request, ...updates, updatedAt: now }
              : request
          ),
        }));
      },
    }),
    buildPersistOptions()
  )
);

export const categoryLabels: Record<HelpRequestCategory, string> = {
  pest_control: "Pest Control",
  irrigation: "Irrigation",
  fertilization: "Fertilization",
  harvesting: "Harvesting",
  equipment: "Equipment",
  financial: "Financial",
  legal: "Legal",
  other: "Other",
};

export const priorityLabels: Record<HelpRequestPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const statusLabels: Record<HelpRequestStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

