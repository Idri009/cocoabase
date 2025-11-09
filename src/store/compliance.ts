import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type ComplianceType =
  | "environmental"
  | "labor"
  | "safety"
  | "quality"
  | "certification"
  | "other";

export type ComplianceStatus = "compliant" | "non_compliant" | "pending" | "expired";

export type ComplianceRecord = {
  id: string;
  type: ComplianceType;
  name: string;
  requirement: string;
  plantationId?: string;
  status: ComplianceStatus;
  dueDate?: string;
  completedDate?: string;
  inspector?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ComplianceRecordDraft = Omit<
  ComplianceRecord,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type ComplianceState = {
  records: ComplianceRecord[];
  addRecord: (draft: ComplianceRecordDraft) => void;
  updateRecord: (id: string, updates: Partial<ComplianceRecordDraft>) => void;
  removeRecord: (id: string) => void;
  getRecordsByStatus: (status: ComplianceStatus) => ComplianceRecord[];
  getOverdueRecords: () => ComplianceRecord[];
};

const generateComplianceId = () =>
  `comp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useComplianceStore = create<ComplianceState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (draft) => {
        const now = new Date().toISOString();
        const record: ComplianceRecord = {
          ...draft,
          id: draft.id ?? generateComplianceId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          records: [...state.records, record],
        }));
      },

      updateRecord: (id, updates) => {
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id
              ? { ...record, ...updates, updatedAt: new Date().toISOString() }
              : record
          ),
        }));
      },

      removeRecord: (id) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        }));
      },

      getRecordsByStatus: (status) => {
        return get().records.filter((record) => record.status === status);
      },

      getOverdueRecords: () => {
        const now = new Date();
        return get().records.filter((record) => {
          if (!record.dueDate) return false;
          if (record.status === "compliant") return false;
          return new Date(record.dueDate) < now;
        });
      },
    }),
    {
      name: "cocoa-chain-compliance",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<ComplianceState>
  )
);

