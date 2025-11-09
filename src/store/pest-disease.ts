import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type PestDiseaseType = "pest" | "disease" | "weed";

export type PestDiseaseSeverity = "low" | "medium" | "high" | "critical";

export type PestDiseaseRecord = {
  id: string;
  type: PestDiseaseType;
  name: string;
  plantationId: string;
  severity: PestDiseaseSeverity;
  affectedArea?: number;
  detectedDate: string;
  treatment?: string;
  treatmentDate?: string;
  status: "active" | "treated" | "resolved";
  notes?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
};

export type PestDiseaseRecordDraft = Omit<
  PestDiseaseRecord,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type PestDiseaseState = {
  records: PestDiseaseRecord[];
  addRecord: (draft: PestDiseaseRecordDraft) => void;
  updateRecord: (id: string, updates: Partial<PestDiseaseRecordDraft>) => void;
  removeRecord: (id: string) => void;
  getActiveRecords: () => PestDiseaseRecord[];
  getRecordsByPlantation: (plantationId: string) => PestDiseaseRecord[];
  getRecordsByType: (type: PestDiseaseType) => PestDiseaseRecord[];
};

const generateRecordId = () =>
  `pd_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const usePestDiseaseStore = create<PestDiseaseState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (draft) => {
        const now = new Date().toISOString();
        const record: PestDiseaseRecord = {
          ...draft,
          id: draft.id ?? generateRecordId(),
          status: draft.status ?? "active",
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

      getActiveRecords: () => {
        return get().records.filter((record) => record.status === "active");
      },

      getRecordsByPlantation: (plantationId) => {
        return get().records.filter(
          (record) => record.plantationId === plantationId
        );
      },

      getRecordsByType: (type) => {
        return get().records.filter((record) => record.type === type);
      },
    }),
    {
      name: "cocoa-chain-pest-disease",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<PestDiseaseState>
  )
);

