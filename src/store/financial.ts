import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type TransactionType = "expense" | "revenue";
export type TransactionCategory =
  | "seeds"
  | "fertilizer"
  | "equipment"
  | "labor"
  | "harvest"
  | "maintenance"
  | "transport"
  | "other";

export type FinancialTransaction = {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  description: string;
  plantationId?: string;
  date: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type FinancialTransactionDraft = Omit<
  FinancialTransaction,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type FinancialState = {
  transactions: FinancialTransaction[];
  addTransaction: (draft: FinancialTransactionDraft) => void;
  updateTransaction: (
    id: string,
    updates: Partial<FinancialTransactionDraft>
  ) => void;
  removeTransaction: (id: string) => void;
  getTransactionsByType: (type: TransactionType) => FinancialTransaction[];
  getTransactionsByCategory: (
    category: TransactionCategory
  ) => FinancialTransaction[];
  getTotalRevenue: () => number;
  getTotalExpenses: () => number;
  getNetProfit: () => number;
};

const generateTransactionId = () =>
  `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (draft) => {
        const now = new Date().toISOString();
        const transaction: FinancialTransaction = {
          ...draft,
          id: draft.id ?? generateTransactionId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          transactions: [...state.transactions, transaction],
        }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((txn) =>
            txn.id === id
              ? { ...txn, ...updates, updatedAt: new Date().toISOString() }
              : txn
          ),
        }));
      },

      removeTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((txn) => txn.id !== id),
        }));
      },

      getTransactionsByType: (type) => {
        return get().transactions.filter((txn) => txn.type === type);
      },

      getTransactionsByCategory: (category) => {
        return get().transactions.filter((txn) => txn.category === category);
      },

      getTotalRevenue: () => {
        return get()
          .getTransactionsByType("revenue")
          .reduce((sum, txn) => sum + txn.amount, 0);
      },

      getTotalExpenses: () => {
        return get()
          .getTransactionsByType("expense")
          .reduce((sum, txn) => sum + txn.amount, 0);
      },

      getNetProfit: () => {
        return get().getTotalRevenue() - get().getTotalExpenses();
      },
    }),
    {
      name: "cocoa-chain-financial",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<FinancialState>
  )
);

