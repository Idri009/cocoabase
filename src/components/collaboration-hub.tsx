"use client";

import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Plantation } from "@/store/plantations";
import {
  buildAnalyticsSnapshot,
  type AnalyticsSnapshot,
  type CollaboratorInsight,
} from "@/lib/analytics";
import { cn } from "@/lib/cn";

type CollaborationHubProps = {
  plantations: Plantation[];
  snapshot?: AnalyticsSnapshot;
  onLogNote: (plantationId: string, collaboratorId: string, note: string) => void;
  onAddCollaborator: (
    plantationId: string,
    collaborator: { name: string; role: string; contact?: string }
  ) => void;
};

function CollaborationHubBase({
  plantations,
  snapshot,
  onLogNote,
  onAddCollaborator,
}: CollaborationHubProps) {
  const analytics = useMemo(
    () => snapshot ?? buildAnalyticsSnapshot(plantations),
    [plantations, snapshot]
  );

  const [selectedPlantationId, setSelectedPlantationId] = useState<string>(
    plantations[0]?.id ?? ""
  );
  const [selectedCollaboratorId, setSelectedCollaboratorId] =
    useState<string>("");
  const [note, setNote] = useState("");
  const [newCollaboratorName, setNewCollaboratorName] = useState("");
  const [newCollaboratorRole, setNewCollaboratorRole] = useState("");
  const [newCollaboratorContact, setNewCollaboratorContact] = useState("");

  const activePlantation = useMemo(
    () =>
      plantations.find((plantation) => plantation.id === selectedPlantationId) ??
      plantations[0],
    [plantations, selectedPlantationId]
  );

  const collaboratorOptions = activePlantation?.collaborators ?? [];

  const insights = analytics.collaboratorInsights.slice(0, 6);

  const handleSubmitNote = () => {
    if (!activePlantation || !selectedCollaboratorId || !note.trim()) {
      return;
    }
    onLogNote(activePlantation.id, selectedCollaboratorId, note.trim());
    setNote("");
  };

  const handleAddCollaborator = () => {
    if (!activePlantation || !newCollaboratorName.trim()) {
      return;
    }

    onAddCollaborator(activePlantation.id, {
      name: newCollaboratorName.trim(),
      role: newCollaboratorRole.trim() || "Contributor",
      contact: newCollaboratorContact.trim() || undefined,
    });

    setNewCollaboratorName("");
    setNewCollaboratorRole("");
    setNewCollaboratorContact("");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="rounded-3xl border border-cream-200 bg-cream-50/85 p-6 shadow-sm shadow-cocoa-900/5 backdrop-blur"
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-cocoa-900">
            Collaboration Hub
          </h2>
          <p className="text-xs uppercase tracking-[0.25em] text-cocoa-500">
            Field teams & agronomists
          </p>
        </div>
        <span className="text-xs text-cocoa-500">
          {insights.length} active collaborators highlighted
        </span>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4 rounded-3xl border border-cream-200 bg-white/80 p-5 shadow-inner shadow-cocoa-900/5">
          <h3 className="text-sm font-semibold text-cocoa-900">
            Log collaboration note
          </h3>
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-[0.2em] text-cocoa-500">
              Plantation
              <select
                value={activePlantation?.id ?? ""}
                onChange={(event) => {
                  setSelectedPlantationId(event.target.value);
                  setSelectedCollaboratorId("");
                }}
                className="mt-2 w-full rounded-2xl border border-cream-300 bg-white/90 px-3 py-2 text-sm text-cocoa-800 shadow-inner focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-300/60"
              >
                {plantations.map((plantation) => (
                  <option key={plantation.id} value={plantation.id}>
                    {plantation.seedName} • {plantation.location ?? "Unknown"}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs uppercase tracking-[0.2em] text-cocoa-500">
              Collaborator
              <select
                value={selectedCollaboratorId}
                onChange={(event) => setSelectedCollaboratorId(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-cream-300 bg-white/90 px-3 py-2 text-sm text-cocoa-800 shadow-inner focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-300/60"
              >
                <option value="">Select collaborator</option>
                {collaboratorOptions.map((collaborator) => (
                  <option key={collaborator.id} value={collaborator.id}>
                    {collaborator.name} • {collaborator.role}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs uppercase tracking-[0.2em] text-cocoa-500">
              Field note
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder="Log scouting insights, supply updates, or sustainability notes…"
                className="mt-2 w-full rounded-2xl border border-cream-300 bg-white/90 px-3 py-2 text-sm text-cocoa-800 shadow-inner focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-300/60"
              />
            </label>

            <button
              type="button"
              onClick={handleSubmitNote}
              className={cn(
                "w-full rounded-full bg-leaf-500 px-5 py-2 text-sm font-semibold text-cream-50 shadow-lg transition",
                "hover:bg-leaf-600 focus:outline-none focus:ring-2 focus:ring-leaf-400 focus:ring-offset-2 focus:ring-offset-cream-50",
                (!selectedCollaboratorId || !note.trim()) &&
                  "cursor-not-allowed opacity-50"
              )}
              disabled={!selectedCollaboratorId || !note.trim()}
            >
              Log note
            </button>
          </div>

          <div className="rounded-2xl border border-dashed border-cream-300 bg-cream-50/80 p-4 text-xs text-cocoa-500">
            Tip: Collaboration notes sync with your timeline for rapid field
            follow-ups.
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-cream-200 bg-white/90 p-5 shadow-sm shadow-cocoa-900/5">
            <h3 className="text-sm font-semibold text-cocoa-900">
              Add collaborator
            </h3>
            <div className="mt-3 space-y-3 text-sm text-cocoa-700">
              <input
                value={newCollaboratorName}
                onChange={(event) => setNewCollaboratorName(event.target.value)}
                placeholder="Name"
                className="w-full rounded-2xl border border-cream-300 bg-white/90 px-3 py-2 shadow-inner focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-300/60"
              />
              <input
                value={newCollaboratorRole}
                onChange={(event) => setNewCollaboratorRole(event.target.value)}
                placeholder="Role (eg. Soil scientist)"
                className="w-full rounded-2xl border border-cream-300 bg-white/90 px-3 py-2 shadow-inner focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-300/60"
              />
              <input
                value={newCollaboratorContact}
                onChange={(event) => setNewCollaboratorContact(event.target.value)}
                placeholder="Contact @handle or email"
                className="w-full rounded-2xl border border-cream-300 bg-white/90 px-3 py-2 shadow-inner focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-300/60"
              />
              <button
                type="button"
                onClick={handleAddCollaborator}
                className={cn(
                  "w-full rounded-full border border-leaf-400 bg-leaf-50 px-5 py-2 text-sm font-semibold text-leaf-700 transition",
                  "hover:bg-leaf-100 focus:outline-none focus:ring-2 focus:ring-leaf-300 focus:ring-offset-2 focus:ring-offset-cream-50",
                  !newCollaboratorName.trim() && "cursor-not-allowed opacity-50"
                )}
                disabled={!newCollaboratorName.trim()}
              >
                Add collaborator
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-cream-200 bg-white/80 p-5 shadow-inner shadow-cocoa-900/5">
            <h3 className="text-sm font-semibold text-cocoa-900">
              Spotlight contributors
            </h3>
            <ul className="mt-3 space-y-3 text-sm text-cocoa-700">
              {insights.map((insight: CollaboratorInsight) => (
                <li
                  key={insight.collaboratorId}
                  className="rounded-2xl border border-cream-200 bg-cream-50/80 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-cocoa-900">
                        {insight.name}
                      </p>
                      <p className="text-xs text-cocoa-500">{insight.role}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.18em] text-cocoa-400">
                      {insight.plantations} plantations
                    </span>
                  </div>
                  {insight.lastNote && (
                    <p className="mt-2 text-xs text-cocoa-600">
                      “{insight.lastNote}”
                    </p>
                  )}
                  {insight.lastUpdated && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-cocoa-400">
                      Updated{" "}
                      {new Date(insight.lastUpdated).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
              {insights.length === 0 && (
                <li className="rounded-2xl border border-dashed border-cream-300 bg-white/70 px-4 py-3 text-xs text-cocoa-500">
                  Add collaborators to unlock spotlight insights.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

const CollaborationHub = memo(CollaborationHubBase);

export default CollaborationHub;


