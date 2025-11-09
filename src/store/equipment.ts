import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type EquipmentStatus = "operational" | "maintenance" | "retired";

export type Equipment = {
  id: string;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  status: EquipmentStatus;
  location?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  maintenanceNotes?: string;
  plantationId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type EquipmentDraft = Omit<
  Equipment,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type EquipmentState = {
  equipment: Equipment[];
  addEquipment: (draft: EquipmentDraft) => void;
  updateEquipment: (id: string, updates: Partial<EquipmentDraft>) => void;
  removeEquipment: (id: string) => void;
  getEquipmentByStatus: (status: EquipmentStatus) => Equipment[];
  getEquipmentDueForMaintenance: () => Equipment[];
};

const generateEquipmentId = () =>
  `eqp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useEquipmentStore = create<EquipmentState>()(
  persist(
    (set, get) => ({
      equipment: [],

      addEquipment: (draft) => {
        const now = new Date().toISOString();
        const item: Equipment = {
          ...draft,
          id: draft.id ?? generateEquipmentId(),
          status: draft.status ?? "operational",
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          equipment: [...state.equipment, item],
        }));
      },

      updateEquipment: (id, updates) => {
        set((state) => ({
          equipment: state.equipment.map((item) =>
            item.id === id
              ? { ...item, ...updates, updatedAt: new Date().toISOString() }
              : item
          ),
        }));
      },

      removeEquipment: (id) => {
        set((state) => ({
          equipment: state.equipment.filter((item) => item.id !== id),
        }));
      },

      getEquipmentByStatus: (status) => {
        return get().equipment.filter((item) => item.status === status);
      },

      getEquipmentDueForMaintenance: () => {
        const now = new Date();
        return get().equipment.filter((item) => {
          if (!item.nextMaintenanceDate) return false;
          const nextDate = new Date(item.nextMaintenanceDate);
          return nextDate <= now && item.status === "operational";
        });
      },
    }),
    {
      name: "cocoa-chain-equipment",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<EquipmentState>
  )
);

