import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type MaintenanceType = "equipment" | "infrastructure" | "irrigation" | "other";

export type MaintenanceStatus = "scheduled" | "in_progress" | "completed" | "overdue";

export type MaintenanceRecord = {
  id: string;
  type: MaintenanceType;
  title: string;
  description?: string;
  equipmentId?: string;
  plantationId?: string;
  scheduledDate: string;
  completedDate?: string;
  cost?: number;
  technician?: string;
  status: MaintenanceStatus;
  priority: "low" | "medium" | "high" | "urgent";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceRecordDraft = Omit<
  MaintenanceRecord,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type MaintenanceState = {
  records: MaintenanceRecord[];
  addRecord: (draft: MaintenanceRecordDraft) => void;
  updateRecord: (id: string, updates: Partial<MaintenanceRecordDraft>) => void;
  removeRecord: (id: string) => void;
  getRecordsByStatus: (status: MaintenanceStatus) => MaintenanceRecord[];
  getOverdueRecords: () => MaintenanceRecord[];
  getRecordsByType: (type: MaintenanceType) => MaintenanceRecord[];
};

const generateMaintenanceId = () =>
  `maint_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useMaintenanceStore = create<MaintenanceState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (draft) => {
        const now = new Date().toISOString();
        const scheduledDate = new Date(draft.scheduledDate);
        const status: MaintenanceStatus =
          scheduledDate < new Date() ? "overdue" : "scheduled";
        const record: MaintenanceRecord = {
          ...draft,
          id: draft.id ?? generateMaintenanceId(),
          status: draft.status || status,
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
          if (record.status === "completed") return false;
          return new Date(record.scheduledDate) < now;
        });
      },

      getRecordsByType: (type) => {
        return get().records.filter((record) => record.type === type);
      },
    }),
    {
      name: "cocoa-chain-maintenance",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<MaintenanceState>
  )
);

