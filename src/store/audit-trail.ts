import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "view"
  | "export"
  | "import"
  | "login"
  | "logout";

export type AuditEntity =
  | "plantation"
  | "task"
  | "harvest"
  | "financial"
  | "inventory"
  | "equipment"
  | "user"
  | "settings"
  | "other";

export type AuditLog = {
  id: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  userId?: string;
  walletAddress?: string;
  description: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
};

type AuditTrailState = {
  logs: AuditLog[];
  addLog: (log: Omit<AuditLog, "id" | "timestamp">) => void;
  getLogsByEntity: (entity: AuditEntity, entityId?: string) => AuditLog[];
  getLogsByUser: (walletAddress: string) => AuditLog[];
  getRecentLogs: (limit?: number) => AuditLog[];
  clearLogs: () => void;
};

const generateAuditId = () =>
  `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const MAX_LOGS = 10000;

export const useAuditTrailStore = create<AuditTrailState>()(
  persist(
    (set, get) => ({
      logs: [],

      addLog: (log) => {
        const auditLog: AuditLog = {
          ...log,
          id: generateAuditId(),
          timestamp: new Date().toISOString(),
        };
        set((state) => {
          const newLogs = [auditLog, ...state.logs].slice(0, MAX_LOGS);
          return { logs: newLogs };
        });
      },

      getLogsByEntity: (entity, entityId) => {
        return get()
          .logs.filter(
            (log) =>
              log.entity === entity &&
              (!entityId || log.entityId === entityId)
          )
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
      },

      getLogsByUser: (walletAddress) => {
        return get()
          .logs.filter((log) => log.walletAddress === walletAddress)
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
      },

      getRecentLogs: (limit = 50) => {
        return get()
          .logs.slice(0, limit)
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
      },

      clearLogs: () => {
        set({ logs: [] });
      },
    }),
    {
      name: "cocoa-chain-audit-trail",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<AuditTrailState>
  )
);

