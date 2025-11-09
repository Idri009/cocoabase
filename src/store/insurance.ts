import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type InsuranceType =
  | "crop"
  | "equipment"
  | "liability"
  | "property"
  | "other";

export type InsuranceStatus = "active" | "expired" | "pending" | "cancelled";

export type InsurancePolicy = {
  id: string;
  type: InsuranceType;
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  premium: number;
  startDate: string;
  endDate: string;
  status: InsuranceStatus;
  plantationId?: string;
  equipmentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type InsurancePolicyDraft = Omit<
  InsurancePolicy,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type InsuranceState = {
  policies: InsurancePolicy[];
  addPolicy: (draft: InsurancePolicyDraft) => void;
  updatePolicy: (id: string, updates: Partial<InsurancePolicyDraft>) => void;
  removePolicy: (id: string) => void;
  getPoliciesByType: (type: InsuranceType) => InsurancePolicy[];
  getExpiringSoon: (days?: number) => InsurancePolicy[];
  getTotalCoverage: () => number;
};

const generateInsuranceId = () =>
  `ins_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useInsuranceStore = create<InsuranceState>()(
  persist(
    (set, get) => ({
      policies: [],

      addPolicy: (draft) => {
        const now = new Date().toISOString();
        const endDate = new Date(draft.endDate);
        const status: InsuranceStatus =
          endDate < new Date() ? "expired" : "active";
        const policy: InsurancePolicy = {
          ...draft,
          id: draft.id ?? generateInsuranceId(),
          status: draft.status || status,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          policies: [...state.policies, policy],
        }));
      },

      updatePolicy: (id, updates) => {
        set((state) => ({
          policies: state.policies.map((policy) =>
            policy.id === id
              ? { ...policy, ...updates, updatedAt: new Date().toISOString() }
              : policy
          ),
        }));
      },

      removePolicy: (id) => {
        set((state) => ({
          policies: state.policies.filter((policy) => policy.id !== id),
        }));
      },

      getPoliciesByType: (type) => {
        return get().policies.filter((policy) => policy.type === type);
      },

      getExpiringSoon: (days = 30) => {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() + days);
        return get().policies.filter((policy) => {
          if (policy.status !== "active") return false;
          const endDate = new Date(policy.endDate);
          return endDate <= threshold && endDate >= new Date();
        });
      },

      getTotalCoverage: () => {
        return get()
          .policies.filter((p) => p.status === "active")
          .reduce((sum, policy) => sum + policy.coverageAmount, 0);
      },
    }),
    {
      name: "cocoa-chain-insurance",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<InsuranceState>
  )
);

