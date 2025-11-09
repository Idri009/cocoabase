"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useAuditTrailStore } from "@/store/audit-trail";
import { useAccount } from "wagmi";

export default function AuditTrail() {
  const logs = useAuditTrailStore((state) => state.logs);
  const getRecentLogs = useAuditTrailStore((state) => state.getRecentLogs);
  const { address } = useAccount();

  const recentLogs = useMemo(() => getRecentLogs(50), [getRecentLogs]);

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "text-emerald-300";
      case "update":
        return "text-blue-300";
      case "delete":
        return "text-rose-300";
      case "view":
        return "text-slate-300";
      default:
        return "text-amber-300";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return "➕";
      case "update":
        return "✏️";
      case "delete":
        return "🗑️";
      case "view":
        return "👁️";
      case "export":
        return "📤";
      case "import":
        return "📥";
      default:
        return "📋";
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cocoa-800/60 bg-[#101f3c]/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur"
    >
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Audit trail</h2>
          <p className="text-sm text-slate-300/80">
            Track all system activities and changes.
          </p>
        </div>
        <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 px-4 py-2">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300/70">
            Total logs
          </p>
          <p className="mt-1 text-xl font-bold text-blue-300">{logs.length}</p>
        </div>
      </header>

      <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
        {recentLogs.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-8 text-center">
            <p className="text-sm text-slate-300/80">
              No audit logs yet. Activity will be tracked here.
            </p>
          </div>
        ) : (
          recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 rounded-xl border border-slate-700/40 bg-slate-900/50 p-3"
            >
              <span className="text-lg">{getActionIcon(log.action)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      getActionColor(log.action)
                    )}
                  >
                    {log.action.toUpperCase()}
                  </span>
                  <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                    {log.entity}
                  </span>
                  {log.entityId && (
                    <span className="text-xs text-slate-400/70 font-mono">
                      {log.entityId.slice(0, 8)}...
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-300/70">{log.description}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400/70">
                  <span>
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  {log.walletAddress && (
                    <span className="font-mono">
                      {log.walletAddress.slice(0, 6)}...
                      {log.walletAddress.slice(-4)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}

