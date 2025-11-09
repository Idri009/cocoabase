import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type SupplierType =
  | "seed_supplier"
  | "fertilizer"
  | "equipment"
  | "labor"
  | "transport"
  | "other";

export type Supplier = {
  id: string;
  name: string;
  type: SupplierType;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  rating?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SupplierDraft = Omit<
  Supplier,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type SuppliersState = {
  suppliers: Supplier[];
  addSupplier: (draft: SupplierDraft) => void;
  updateSupplier: (id: string, updates: Partial<SupplierDraft>) => void;
  removeSupplier: (id: string) => void;
  getActiveSuppliers: () => Supplier[];
  getSuppliersByType: (type: SupplierType) => Supplier[];
  searchSuppliers: (query: string) => Supplier[];
};

const generateSupplierId = () =>
  `supp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useSuppliersStore = create<SuppliersState>()(
  persist(
    (set, get) => ({
      suppliers: [],

      addSupplier: (draft) => {
        const now = new Date().toISOString();
        const supplier: Supplier = {
          ...draft,
          id: draft.id ?? generateSupplierId(),
          isActive: draft.isActive !== undefined ? draft.isActive : true,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          suppliers: [...state.suppliers, supplier],
        }));
      },

      updateSupplier: (id, updates) => {
        set((state) => ({
          suppliers: state.suppliers.map((supplier) =>
            supplier.id === id
              ? { ...supplier, ...updates, updatedAt: new Date().toISOString() }
              : supplier
          ),
        }));
      },

      removeSupplier: (id) => {
        set((state) => ({
          suppliers: state.suppliers.filter((supplier) => supplier.id !== id),
        }));
      },

      getActiveSuppliers: () => {
        return get().suppliers.filter((supplier) => supplier.isActive);
      },

      getSuppliersByType: (type) => {
        return get().suppliers.filter((supplier) => supplier.type === type);
      },

      searchSuppliers: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().suppliers.filter(
          (supplier) =>
            supplier.name.toLowerCase().includes(lowerQuery) ||
            supplier.contactPerson?.toLowerCase().includes(lowerQuery) ||
            supplier.email?.toLowerCase().includes(lowerQuery) ||
            supplier.phone?.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: "cocoa-chain-suppliers",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<SuppliersState>
  )
);

