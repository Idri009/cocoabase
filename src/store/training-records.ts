import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type TrainingType =
  | "safety"
  | "technical"
  | "certification"
  | "compliance"
  | "other";

export type TrainingStatus = "scheduled" | "completed" | "cancelled";

export type TrainingRecord = {
  id: string;
  type: TrainingType;
  title: string;
  description?: string;
  trainer?: string;
  participants: string[];
  scheduledDate: string;
  completedDate?: string;
  duration?: number;
  cost?: number;
  certificateIssued?: boolean;
  status: TrainingStatus;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
};

export type TrainingRecordDraft = Omit<
  TrainingRecord,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type TrainingRecordsState = {
  records: TrainingRecord[];
  addRecord: (draft: TrainingRecordDraft) => void;
  updateRecord: (id: string, updates: Partial<TrainingRecordDraft>) => void;
  removeRecord: (id: string) => void;
  getRecordsByType: (type: TrainingType) => TrainingRecord[];
  getUpcomingTrainings: (days?: number) => TrainingRecord[];
  getRecordsByParticipant: (participant: string) => TrainingRecord[];
};

const generateTrainingId = () =>
  `training_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useTrainingRecordsStore = create<TrainingRecordsState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (draft) => {
        const now = new Date().toISOString();
        const record: TrainingRecord = {
          ...draft,
          id: draft.id ?? generateTrainingId(),
          participants: draft.participants || [],
          attachments: draft.attachments || [],
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

      getRecordsByType: (type) => {
        return get()
          .records.filter((record) => record.type === type)
          .sort(
            (a, b) =>
              new Date(b.scheduledDate).getTime() -
              new Date(a.scheduledDate).getTime()
          );
      },

      getUpcomingTrainings: (days = 30) => {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() + days);
        return get()
          .records.filter((record) => {
            if (record.status !== "scheduled") return false;
            const scheduled = new Date(record.scheduledDate);
            return scheduled >= new Date() && scheduled <= threshold;
          })
          .sort(
            (a, b) =>
              new Date(a.scheduledDate).getTime() -
              new Date(b.scheduledDate).getTime()
          );
      },

      getRecordsByParticipant: (participant) => {
        return get()
          .records.filter((record) =>
            record.participants.includes(participant)
          )
          .sort(
            (a, b) =>
              new Date(b.scheduledDate).getTime() -
              new Date(a.scheduledDate).getTime()
          );
      },
    }),
    {
      name: "cocoa-chain-training-records",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<TrainingRecordsState>
  )
);

