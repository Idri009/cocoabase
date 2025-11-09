"use client";

import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  useEngagementStore,
  type ComplaintStatus,
  computeComplaintStats,
} from "@/store/engagement";
import { cn } from "@/lib/cn";

type FilterOption = ComplaintStatus | "all";

const statusBadges: Record<ComplaintStatus, string> = {
  open: "bg-amber-100 text-amber-700",
  in_progress: "bg-sky-100 text-sky-800",
  resolved: "bg-leaf-100 text-leaf-700",
};

const statusLabels: Record<ComplaintStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
};

const priorityPills = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-gold-100 text-gold-700",
  low: "bg-cream-200 text-cocoa-600",
} as const;

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

const formatRelativeTime = (iso: string) =>
  new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  }).format(
    Math.round(
      (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ),
    "day"
  );

function CommunitySupportPanelBase() {
  const complaints = useEngagementStore((state) => state.complaints);
  const updateComplaintStatus = useEngagementStore(
    (state) => state.updateComplaintStatus
  );

  const [filter, setFilter] = useState<FilterOption>("all");

  const stats = useMemo(
    () => computeComplaintStats(complaints),
    [complaints]
  );

  const filteredComplaints = useMemo(() => {
    const sorted = complaints
      .slice()
      .sort(
        (a, b) =>
          new Date(a.status === "resolved" ? a.updatedAt : a.createdAt).getTime() -
          new Date(b.status === "resolved" ? b.updatedAt : b.createdAt).getTime()
      );

    if (filter === "all") {
      return sorted;
    }

    return sorted.filter((complaint) => complaint.status === filter);
  }, [complaints, filter]);

  const handleNextStatus = (status: ComplaintStatus): ComplaintStatus => {
    if (status === "open") return "in_progress";
    if (status === "in_progress") return "resolved";
    return "resolved";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-3xl border border-cream-200 bg-cream-50/85 p-5 shadow-sm shadow-cocoa-900/5 backdrop-blur"
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-cocoa-900">
            Community Support
          </h2>
          <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
            Complaints & escalations
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-cocoa-600">
          <span className="rounded-full bg-white/70 px-3 py-1 font-semibold shadow-sm">
            {stats.counts.open} open
          </span>
          <span className="rounded-full bg-white/70 px-3 py-1 font-semibold shadow-sm">
            {stats.counts.in_progress} in triage
          </span>
          <span className="rounded-full bg-white/70 px-3 py-1 font-semibold shadow-sm">
            {stats.counts.resolved} resolved
          </span>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition",
              filter === option.value
                ? "border-cocoa-900 bg-cocoa-900 text-cream-100"
                : "border-cream-300 bg-white text-cocoa-600 hover:border-cocoa-300"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="rounded-2xl border border-cream-200 bg-white/70 px-4 py-6 text-sm text-cocoa-500">
            No complaints found for this filter. You're all caught up!
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <article
              key={complaint.id}
              className="rounded-2xl border border-cream-200 bg-white/80 p-4 text-sm text-cocoa-700 shadow-sm shadow-cocoa-900/5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-cocoa-900">
                    {complaint.subject}
                  </h3>
                  <p className="text-xs text-cocoa-500">
                    {complaint.category} • {formatRelativeTime(complaint.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
                      statusBadges[complaint.status]
                    )}
                  >
                    {statusLabels[complaint.status]}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide",
                      priorityPills[complaint.priority]
                    )}
                  >
                    {complaint.priority} priority
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm text-cocoa-700">{complaint.description}</p>

              {complaint.attachments.length ? (
                <ul className="mt-3 space-y-1 text-xs text-cocoa-500">
                  {complaint.attachments.map((attachment) => (
                    <li key={attachment.id}>
                      <a
                        href={attachment.storageUrl}
                        className="underline underline-offset-2 hover:text-cocoa-800"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {attachment.fileName}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-cocoa-500">
                <span>
                  Updated {new Date(complaint.updatedAt).toLocaleString()}
                </span>
                {complaint.status !== "resolved" ? (
                  <button
                    type="button"
                    onClick={() => {
                      const next = handleNextStatus(complaint.status);
                      updateComplaintStatus(complaint.id, next);
                    }}
                    className="rounded-full border border-cocoa-200 px-3 py-1 font-semibold uppercase tracking-wide text-cocoa-600 transition hover:border-cocoa-300 hover:text-cocoa-900 focus:outline-none focus:ring-2 focus:ring-cocoa-300 focus:ring-offset-1 focus:ring-offset-cream-50"
                  >
                    Mark {statusLabels[handleNextStatus(complaint.status)]}
                  </button>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>

      {stats.highPriorityOpen ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-xs text-rose-700">
          {stats.highPriorityOpen} high priority complaint
          {stats.highPriorityOpen === 1 ? "" : "s"} awaiting attention.
        </div>
      ) : null}
    </motion.section>
  );
}

const CommunitySupportPanel = memo(CommunitySupportPanelBase);

export default CommunitySupportPanel;


