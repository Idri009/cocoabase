import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type ComplianceCategory =
  | "organic"
  | "fair_trade"
  | "environmental"
  | "labor"
  | "safety"
  | "tax"
  | "other";

export type ComplianceItem = {
  id: string;
  category: ComplianceCategory;
  title: string;
  description?: string;
  requirement: string;
  dueDate?: string;
  completedDate?: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
  plantationId?: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
};

export type ComplianceItemDraft = Omit<
  ComplianceItem,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type ComplianceChecklistState = {
  items: ComplianceItem[];
  addItem: (draft: ComplianceItemDraft) => void;
  updateItem: (id: string, updates: Partial<ComplianceItemDraft>) => void;
  removeItem: (id: string) => void;
  getItemsByCategory: (category: ComplianceCategory) => ComplianceItem[];
  getOverdueItems: () => ComplianceItem[];
  getItemsByStatus: (status: ComplianceItem["status"]) => ComplianceItem[];
};

const generateComplianceId = () =>
  `comp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useComplianceChecklistStore = create<ComplianceChecklistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (draft) => {
        const now = new Date().toISOString();
        const dueDate = draft.dueDate ? new Date(draft.dueDate) : null;
        const status: ComplianceItem["status"] =
          draft.status ||
          (dueDate && dueDate < new Date() ? "overdue" : "pending");
        const item: ComplianceItem = {
          ...draft,
          id: draft.id ?? generateComplianceId(),
          status,
          attachments: draft.attachments || [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          items: [...state.items, item],
        }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const updated = { ...item, ...updates };
              if (updates.dueDate !== undefined) {
                const dueDate = updated.dueDate
                  ? new Date(updated.dueDate)
                  : null;
                if (
                  dueDate &&
                  dueDate < new Date() &&
                  updated.status !== "completed"
                ) {
                  updated.status = "overdue";
                }
              }
              updated.updatedAt = new Date().toISOString();
              return updated;
            }
            return item;
          }),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      getItemsByCategory: (category) => {
        return get().items.filter((item) => item.category === category);
      },

      getOverdueItems: () => {
        return get().items.filter((item) => item.status === "overdue");
      },

      getItemsByStatus: (status) => {
        return get().items.filter((item) => item.status === status);
      },
    }),
    {
      name: "cocoa-chain-compliance-checklist",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<ComplianceChecklistState>
  )
);

