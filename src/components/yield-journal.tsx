"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type {
  Plantation,
  YieldCheckpointDraft,
  GrowthStage,
} from "@/store/plantations";

type YieldJournalProps = {
  plantations: Plantation[];
  onAddEntry: (plantationId: string, entry: YieldCheckpointDraft) => void;
  onAddPhoto: (
    plantationId: string,
    checkpointId: string,
    photoUrl: string
  ) => void;
};

type EntryFormState = {
  date: string;
  event: string;
  yieldKg: string;
  notes: string;
  photoDraft: string;
  photos: string[];
};

const stageOptions: Array<{ value: GrowthStage | "all"; label: string }> = [
  { value: "all", label: "All stages" },
  { value: "planted", label: "Planted" },
  { value: "growing", label: "Growing" },
  { value: "harvested", label: "Harvested" },
];

const stageLabels: Record<GrowthStage, string> = {
  planted: "Planted",
  growing: "Growing",
  harvested: "Harvested",
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString();
};

export default function YieldJournal({
  plantations,
  onAddEntry,
  onAddPhoto,
}: YieldJournalProps) {
  const [stageFilter, setStageFilter] = useState<GrowthStage | "all">("all");
  const [attachmentDrafts, setAttachmentDrafts] = useState<Record<string, string>>(
    {}
  );

  const filteredPlantations = useMemo(() => {
    if (stageFilter === "all") {
      return plantations;
    }
    return plantations.filter((plantation) => plantation.stage === stageFilter);
  }, [plantations, stageFilter]);

  const [selectedPlantationId, setSelectedPlantationId] = useState<string>(() =>
    filteredPlantations[0]?.id ?? ""
  );

  useEffect(() => {
    if (!filteredPlantations.length) {
      setSelectedPlantationId("");
      return;
    }
    const exists = filteredPlantations.some(
      (plantation) => plantation.id === selectedPlantationId
    );
    if (!exists) {
      setSelectedPlantationId(filteredPlantations[0].id);
    }
  }, [filteredPlantations, selectedPlantationId]);

  const selectedPlantation = filteredPlantations.find(
    (plantation) => plantation.id === selectedPlantationId
  );

  const [form, setForm] = useState<EntryFormState>(() => ({
    date: new Date().toISOString().slice(0, 10),
    event: "",
    yieldKg: "",
    notes: "",
    photoDraft: "",
    photos: [],
  }));

  useEffect(() => {
    setForm({
      date: new Date().toISOString().slice(0, 10),
      event: "",
      yieldKg: "",
      notes: "",
      photoDraft: "",
      photos: [],
    });
  }, [selectedPlantationId]);

  const entries = useMemo(() => {
    if (!selectedPlantation) {
      return [];
    }
    return [...selectedPlantation.yieldTimeline].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [selectedPlantation]);

  const totals = useMemo(() => {
    const totalYield = entries.reduce((sum, entry) => sum + entry.yieldKg, 0);
    const latest = entries[0];
    return {
      totalYield,
      events: entries.length,
      latestDate: latest ? formatDate(latest.date) : null,
    };
  }, [entries]);

  const handleAddPhotoToForm = () => {
    const trimmed = form.photoDraft.trim();
    if (!trimmed) {
      return;
    }
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.includes(trimmed)
        ? prev.photos
        : [...prev.photos, trimmed],
      photoDraft: "",
    }));
  };

  const handleRemovePhotoFromForm = (url: string) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo !== url),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPlantationId || !form.event.trim()) {
      return;
    }
    const parsedYield = Number(form.yieldKg);
    onAddEntry(selectedPlantationId, {
      date: form.date,
      event: form.event.trim(),
      yieldKg: Number.isFinite(parsedYield) ? parsedYield : 0,
      notes: form.notes.trim() ? form.notes.trim() : undefined,
      photos: form.photos,
    });
    setForm({
      date: new Date().toISOString().slice(0, 10),
      event: "",
      yieldKg: "",
      notes: "",
      photoDraft: "",
      photos: [],
    });
  };

  const handleAddPhotoToEntry = (checkpointId: string) => {
    const draft = attachmentDrafts[checkpointId]?.trim();
    if (!draft || !selectedPlantationId) {
      return;
    }
    onAddPhoto(selectedPlantationId, checkpointId, draft);
    setAttachmentDrafts((prev) => ({ ...prev, [checkpointId]: "" }));
  };

  if (!plantations.length) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cocoa-800/60 bg-[#101f3c]/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur"
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Yield journal</h2>
          <p className="text-sm text-slate-300/80">
            Chronicle agronomic events, yields, and field observations across
            plantations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={stageFilter}
            onChange={(event) =>
              setStageFilter(event.target.value as GrowthStage | "all")
            }
            className="rounded-full border border-slate-600/40 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 focus:border-leaf-400/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
          >
            {stageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={selectedPlantationId}
            onChange={(event) => setSelectedPlantationId(event.target.value)}
            className="rounded-full border border-slate-600/40 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 focus:border-leaf-400/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
          >
            {filteredPlantations.map((plantation) => (
              <option key={plantation.id} value={plantation.id}>
                {plantation.seedName}
              </option>
            ))}
          </select>
        </div>
      </header>

      {!selectedPlantation ? (
        <p className="mt-6 text-sm text-slate-300/80">
          No plantations match the current filters. Adjust the stage filter or
          connect a wallet to view journal entries.
        </p>
      ) : (
        <>
          <section className="mt-6 grid gap-3 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Plantation
              </p>
              <p className="text-sm font-semibold text-white">
                {selectedPlantation.seedName}
              </p>
              <p className="text-xs text-slate-300/70">
                {stageLabels[selectedPlantation.stage]}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Recorded yield
              </p>
              <p className="text-sm font-semibold text-white">
                {totals.totalYield.toLocaleString()} kg
              </p>
              <p className="text-xs text-slate-300/70">
                Across {totals.events} event{totals.events === 1 ? "" : "s"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Latest entry
              </p>
              <p className="text-sm font-semibold text-white">
                {totals.latestDate ?? "—"}
              </p>
              <p className="text-xs text-slate-300/70">
                {entries[0]?.event ?? "Awaiting first entry"}
              </p>
            </div>
          </section>

          <form
            className="mt-6 grid gap-4 rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4 md:grid-cols-[200px,1fr]"
            onSubmit={handleSubmit}
          >
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, date: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Yield (kg)
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.yieldKg}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      yieldKg: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                />
              </label>
            </div>
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Event title
                <input
                  type="text"
                  value={form.event}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, event: event.target.value }))
                  }
                  placeholder="e.g. Mid-season canopy audit"
                  className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Notes
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, notes: event.target.value }))
                  }
                  rows={2}
                  placeholder="Optional observations, soil readings, collaborator insights…"
                  className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
                Photo / document URL
                <div className="mt-1 flex gap-2">
                  <input
                    type="url"
                    value={form.photoDraft}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        photoDraft: event.target.value,
                      }))
                    }
                    placeholder="https://example.com/inspection.jpg"
                    className="flex-1 rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoToForm}
                    className="rounded-full border border-slate-600/40 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-200/90 transition hover:border-slate-400/60 hover:text-white"
                  >
                    Add
                  </button>
                </div>
              </label>
              {form.photos.length > 0 && (
                <ul className="flex flex-wrap gap-2 text-xs text-slate-300/80">
                  {form.photos.map((url) => (
                    <li
                      key={url}
                      className="flex items-center gap-2 rounded-full border border-slate-700/40 bg-slate-900/60 px-2 py-1"
                    >
                      <span className="truncate max-w-[180px]">{url}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhotoFromForm(url)}
                        className="text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!form.event.trim() || !selectedPlantationId}
                  className="rounded-full bg-leaf-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-300 focus:ring-offset-2 focus:ring-offset-slate-900/60 disabled:cursor-not-allowed disabled:bg-slate-700/40 disabled:text-slate-300/60"
                >
                  Log yield event
                </button>
              </div>
            </div>
          </form>

          <section className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300/70">
              Timeline
            </h3>
            {entries.length === 0 ? (
              <p className="text-sm text-slate-300/80">
                No yield events logged yet. Use the form above to capture the
                first milestone.
              </p>
            ) : (
              <ul className="space-y-4">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-4"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400/70">
                          {formatDate(entry.date)}
                        </p>
                        <h4 className="text-sm font-semibold text-white">
                          {entry.event}
                        </h4>
                        <p className="text-xs text-slate-300/70">
                          {entry.yieldKg.toLocaleString()} kg captured
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300/70">
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                          {stageLabels[selectedPlantation.stage]}
                        </span>
                        {entry.photos.length > 0 && (
                          <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                            {entry.photos.length} attachment
                            {entry.photos.length === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="mt-2 text-xs italic text-slate-300/70">
                        {entry.notes}
                      </p>
                    )}
                    {entry.photos.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-2 text-xs text-leaf-200">
                        {entry.photos.map((url) => (
                          <li key={url}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-leaf-400/40 bg-leaf-500/10 px-2 py-0.5 underline-offset-2 hover:underline"
                            >
                              View attachment
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-3 flex flex-col gap-2 text-xs text-slate-300/70 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={attachmentDrafts[entry.id] ?? ""}
                          onChange={(event) =>
                            setAttachmentDrafts((prev) => ({
                              ...prev,
                              [entry.id]: event.target.value,
                            }))
                          }
                          placeholder="Add photo/document URL"
                          className="w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-1 text-xs text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40 md:w-72"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddPhotoToEntry(entry.id)}
                          className="rounded-full border border-slate-600/40 bg-slate-900/70 px-3 py-1 font-semibold text-slate-200/90 transition hover:border-slate-400/60 hover:text-white"
                        >
                          Attach
                        </button>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.25em] text-slate-400/70">
                        Entry ID {entry.id.slice(-6)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </motion.section>
  );
}


