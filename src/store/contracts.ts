import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type ContractType =
  | "supply"
  | "purchase"
  | "service"
  | "lease"
  | "labor"
  | "other";

export type ContractStatus = "draft" | "active" | "expired" | "terminated";

export type Contract = {
  id: string;
  type: ContractType;
  title: string;
  counterparty: string;
  startDate: string;
  endDate?: string;
  value?: number;
  currency?: string;
  terms?: string;
  status: ContractStatus;
  plantationId?: string;
  supplierId?: string;
  renewalDate?: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
};

export type ContractDraft = Omit<
  Contract,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type ContractsState = {
  contracts: Contract[];
  addContract: (draft: ContractDraft) => void;
  updateContract: (id: string, updates: Partial<ContractDraft>) => void;
  removeContract: (id: string) => void;
  getContractsByStatus: (status: ContractStatus) => Contract[];
  getExpiringContracts: (days?: number) => Contract[];
  getContractsByType: (type: ContractType) => Contract[];
};

const generateContractId = () =>
  `contract_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useContractsStore = create<ContractsState>()(
  persist(
    (set, get) => ({
      contracts: [],

      addContract: (draft) => {
        const now = new Date().toISOString();
        const endDate = draft.endDate ? new Date(draft.endDate) : null;
        const status: ContractStatus =
          draft.status ||
          (endDate && endDate < new Date() ? "expired" : "draft");
        const contract: Contract = {
          ...draft,
          id: draft.id ?? generateContractId(),
          status,
          attachments: draft.attachments || [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          contracts: [...state.contracts, contract],
        }));
      },

      updateContract: (id, updates) => {
        set((state) => ({
          contracts: state.contracts.map((contract) =>
            contract.id === id
              ? { ...contract, ...updates, updatedAt: new Date().toISOString() }
              : contract
          ),
        }));
      },

      removeContract: (id) => {
        set((state) => ({
          contracts: state.contracts.filter((contract) => contract.id !== id),
        }));
      },

      getContractsByStatus: (status) => {
        return get().contracts.filter((contract) => contract.status === status);
      },

      getExpiringContracts: (days = 30) => {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() + days);
        return get().contracts.filter((contract) => {
          if (contract.status !== "active") return false;
          if (!contract.endDate) return false;
          const endDate = new Date(contract.endDate);
          return endDate <= threshold && endDate >= new Date();
        });
      },

      getContractsByType: (type) => {
        return get().contracts.filter((contract) => contract.type === type);
      },
    }),
    {
      name: "cocoa-chain-contracts",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<ContractsState>
  )
);

