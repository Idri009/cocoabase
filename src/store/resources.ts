import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type ResourceType = "labor" | "equipment" | "vehicle" | "other";

export type ResourceAllocation = {
  id: string;
  type: ResourceType;
  name: string;
  plantationId: string;
  taskId?: string;
  startDate: string;
  endDate?: string;
  hours?: number;
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ResourceAllocationDraft = Omit<
  ResourceAllocation,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type ResourceState = {
  allocations: ResourceAllocation[];
  addAllocation: (draft: ResourceAllocationDraft) => void;
  updateAllocation: (
    id: string,
    updates: Partial<ResourceAllocationDraft>
  ) => void;
  removeAllocation: (id: string) => void;
  getAllocationsByType: (type: ResourceType) => ResourceAllocation[];
  getAllocationsByPlantation: (
    plantationId: string
  ) => ResourceAllocation[];
  getTotalCost: (startDate?: string, endDate?: string) => number;
};

const generateResourceId = () =>
  `res_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useResourceStore = create<ResourceState>()(
  persist(
    (set, get) => ({
      allocations: [],

      addAllocation: (draft) => {
        const now = new Date().toISOString();
        const allocation: ResourceAllocation = {
          ...draft,
          id: draft.id ?? generateResourceId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          allocations: [...state.allocations, allocation],
        }));
      },

      updateAllocation: (id, updates) => {
        set((state) => ({
          allocations: state.allocations.map((alloc) =>
            alloc.id === id
              ? { ...alloc, ...updates, updatedAt: new Date().toISOString() }
              : alloc
          ),
        }));
      },

      removeAllocation: (id) => {
        set((state) => ({
          allocations: state.allocations.filter((alloc) => alloc.id !== id),
        }));
      },

      getAllocationsByType: (type) => {
        return get().allocations.filter((alloc) => alloc.type === type);
      },

      getAllocationsByPlantation: (plantationId) => {
        return get().allocations.filter(
          (alloc) => alloc.plantationId === plantationId
        );
      },

      getTotalCost: (startDate, endDate) => {
        return get()
          .allocations.filter((alloc) => {
            if (startDate && alloc.startDate < startDate) return false;
            if (endDate && alloc.startDate > endDate) return false;
            return true;
          })
          .reduce((sum, alloc) => sum + (alloc.cost || 0), 0);
      },
    }),
    {
      name: "cocoa-chain-resources",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<ResourceState>
  )
);

