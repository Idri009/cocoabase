import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type BudgetCategory =
  | "seeds"
  | "fertilizer"
  | "equipment"
  | "labor"
  | "maintenance"
  | "irrigation"
  | "harvest"
  | "transport"
  | "other";

export type Budget = {
  id: string;
  name: string;
  category: BudgetCategory;
  plantationId?: string;
  allocatedAmount: number;
  spentAmount: number;
  period: {
    start: string;
    end: string;
  };
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type BudgetDraft = Omit<
  Budget,
  "id" | "createdAt" | "updatedAt" | "spentAmount"
> & {
  id?: string;
  spentAmount?: number;
};

type BudgetState = {
  budgets: Budget[];
  addBudget: (draft: BudgetDraft) => void;
  updateBudget: (id: string, updates: Partial<BudgetDraft>) => void;
  updateSpent: (id: string, amount: number) => void;
  removeBudget: (id: string) => void;
  getBudgetsByCategory: (category: BudgetCategory) => Budget[];
  getTotalAllocated: () => number;
  getTotalSpent: () => number;
  getRemainingBudget: () => number;
};

const generateBudgetId = () =>
  `budget_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: [],

      addBudget: (draft) => {
        const now = new Date().toISOString();
        const budget: Budget = {
          ...draft,
          id: draft.id ?? generateBudgetId(),
          spentAmount: draft.spentAmount ?? 0,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          budgets: [...state.budgets, budget],
        }));
      },

      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id
              ? { ...budget, ...updates, updatedAt: new Date().toISOString() }
              : budget
          ),
        }));
      },

      updateSpent: (id, amount) => {
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id
              ? {
                  ...budget,
                  spentAmount: amount,
                  updatedAt: new Date().toISOString(),
                }
              : budget
          ),
        }));
      },

      removeBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        }));
      },

      getBudgetsByCategory: (category) => {
        return get().budgets.filter((budget) => budget.category === category);
      },

      getTotalAllocated: () => {
        return get().budgets.reduce(
          (sum, budget) => sum + budget.allocatedAmount,
          0
        );
      },

      getTotalSpent: () => {
        return get().budgets.reduce(
          (sum, budget) => sum + budget.spentAmount,
          0
        );
      },

      getRemainingBudget: () => {
        return get().getTotalAllocated() - get().getTotalSpent();
      },
    }),
    {
      name: "cocoa-chain-budget",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<BudgetState>
  )
);

