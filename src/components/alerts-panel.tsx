"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type Alert,
  type AlertChannelState,
  useAlertsStore,
} from "@/store/alerts";
import { cn } from "@/lib/cn";

const channelLabels: Record<AlertChannelState["channel"], string> = {
  in_app: "In-App",
  email: "Email",
  sms: "SMS",
};

const channelStatusStyles: Record<
  AlertChannelState["status"],
  string
> = {
  pending: "bg-amber-100 text-amber-700",
  sent: "bg-leaf-100 text-leaf-700",
  failed: "bg-rose-100 text-rose-700",
};

const severityBadgeStyles: Record<
  Alert["severity"],
  string
> = {
  info: "bg-sky-100 text-sky-700",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-rose-100 text-rose-700",
};

const formatRelativeTime = (timestamp: string) => {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return "Just now";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};

export default function AlertsPanel() {
  const alerts = useAlertsStore((state) => state.alerts);
  const acknowledgeAlert = useAlertsStore((state) => state.acknowledgeAlert);
  const dismissAlert = useAlertsStore((state) => state.dismissAlert);
  const clearAll = useAlertsStore((state) => state.clearAll);

  const stats = useMemo(() => {
    const total = alerts.length;
    const pending = alerts.filter((alert) => !alert.acknowledged).length;
    return { total, pending };
  }, [alerts]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-3xl border border-cream-200 bg-cream-50/80 p-5 shadow-sm shadow-cocoa-900/5 backdrop-blur"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-cocoa-900">Alerts</h2>
          <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
            {stats.pending} pending · {stats.total} total
          </p>
        </div>
        {alerts.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold uppercase tracking-wide text-cocoa-400 transition hover:text-cocoa-700 focus:outline-none focus:ring-1 focus:ring-cocoa-300 focus:ring-offset-2 focus:ring-offset-cream-50"
          >
            Clear all
          </button>
        )}
      </header>

      <div className="mt-4 space-y-3">
        {alerts.length === 0 ? (
          <div className="rounded-2xl bg-white/70 p-4 text-sm text-cocoa-500 shadow-inner">
            No alerts yet. Upcoming deadlines, stage changes, and wallet events
            will appear here.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {alerts.map((alert) => (
              <motion.article
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "rounded-2xl border border-cream-200 bg-white/85 p-4 shadow-sm",
                  !alert.acknowledged && "border-leaf-200"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
                          severityBadgeStyles[alert.severity]
                        )}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs text-cocoa-400">
                        {formatRelativeTime(alert.createdAt)}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-cocoa-900">
                      {alert.title}
                    </h3>
                    {alert.description && (
                      <p className="mt-1 text-xs text-cocoa-600">
                        {alert.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => dismissAlert(alert.id)}
                      className="rounded-full px-2 py-1 text-xs uppercase tracking-wide text-cocoa-300 transition hover:text-cocoa-500 focus:outline-none focus:ring-1 focus:ring-cocoa-200 focus:ring-offset-1 focus:ring-offset-white"
                    >
                      Dismiss
                    </button>
                    {!alert.acknowledged && (
                      <button
                        type="button"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="rounded-full bg-cocoa-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream-50 shadow-sm transition hover:bg-cocoa-800 focus:outline-none focus:ring-2 focus:ring-cocoa-500 focus:ring-offset-1 focus:ring-offset-white"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-cocoa-500">
                  {alert.channels.map((channel) => (
                    <span
                      key={channel.channel}
                      className={cn(
                        "rounded-full px-2.5 py-1 font-medium capitalize",
                        channelStatusStyles[channel.status]
                      )}
                    >
                      {channelLabels[channel.channel]} · {channel.status}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.section>
  );
}


