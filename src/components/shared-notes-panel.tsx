"use client";

import { useMemo, useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  usePlantationsStore,
  type Plantation,
  type SharedNoteDraft,
} from "@/store/plantations";
import { useAccount } from "wagmi";

type SharedNotesPanelProps = {
  plantations: Plantation[];
};

type NoteFormState = {
  plantationId: string;
  content: string;
  tagInput: string;
  tags: string[];
  attachmentUrl: string;
  attachments: string[];
};

const defaultFormState: NoteFormState = {
  plantationId: "",
  content: "",
  tagInput: "",
  tags: [],
  attachmentUrl: "",
  attachments: [],
};

export default function SharedNotesPanel({
  plantations,
}: SharedNotesPanelProps) {
  const { address } = useAccount();
  const sharedNotes = usePlantationsStore((state) => state.sharedNotes);
  const addSharedNote = usePlantationsStore((state) => state.addSharedNote);
  const updateSharedNote = usePlantationsStore(
    (state) => state.updateSharedNote
  );
  const removeSharedNote = usePlantationsStore(
    (state) => state.removeSharedNote
  );
  const getSharedNotesForPlantation = usePlantationsStore(
    (state) => state.getSharedNotesForPlantation
  );

  const [form, setForm] = useState<NoteFormState>(defaultFormState);
  const [selectedPlantationId, setSelectedPlantationId] = useState<
    string | "all"
  >("all");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const filteredNotes = useMemo(() => {
    if (selectedPlantationId === "all") {
      return [...sharedNotes].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return getSharedNotesForPlantation(selectedPlantationId);
  }, [sharedNotes, selectedPlantationId, getSharedNotesForPlantation]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!address || !form.plantationId || !form.content.trim()) {
      return;
    }

    const draft: SharedNoteDraft = {
      plantationId: form.plantationId,
      authorWalletAddress: address,
      content: form.content.trim(),
      tags: form.tags,
      attachments: form.attachments,
    };

    addSharedNote(draft);
    setForm(defaultFormState);
  };

  const handleAddTag = () => {
    const trimmed = form.tagInput.trim().toLowerCase();
    if (!trimmed || form.tags.includes(trimmed)) {
      return;
    }
    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, trimmed],
      tagInput: "",
    }));
  };

  const handleAddAttachment = () => {
    const trimmed = form.attachmentUrl.trim();
    if (!trimmed || form.attachments.includes(trimmed)) {
      return;
    }
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, trimmed],
      attachmentUrl: "",
    }));
  };

  const handleStartEdit = (noteId: string, content: string) => {
    setEditingNoteId(noteId);
    setEditContent(content);
  };

  const handleSaveEdit = () => {
    if (!editingNoteId || !editContent.trim()) {
      return;
    }
    updateSharedNote(editingNoteId, { content: editContent.trim() });
    setEditingNoteId(null);
    setEditContent("");
  };

  const formatWalletAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getAuthorName = (note: typeof sharedNotes[0]) => {
    if (note.authorName) {
      return note.authorName;
    }
    const plantation = plantations.find(
      (p) => p.walletAddress === note.authorWalletAddress
    );
    if (plantation) {
      return plantation.seedName;
    }
    return formatWalletAddress(note.authorWalletAddress);
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
          <h2 className="text-lg font-semibold text-white">Shared notes</h2>
          <p className="text-sm text-slate-300/80">
            Collaborative notes and observations for plantations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPlantationId}
            onChange={(event) =>
              setSelectedPlantationId(
                event.target.value as string | "all"
              )
            }
            className="rounded-full border border-slate-600/40 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 focus:border-leaf-400/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
          >
            <option value="all">All plantations</option>
            {plantations.map((plantation) => (
              <option key={plantation.id} value={plantation.id}>
                {plantation.seedName}
              </option>
            ))}
          </select>
          <span className="rounded-full bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300/70">
            {sharedNotes.length} note{sharedNotes.length === 1 ? "" : "s"}
          </span>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300/70">
            Add note
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Plantation
              <select
                value={form.plantationId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    plantationId: event.target.value,
                  }))
                }
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                required
              >
                <option value="">Select plantation</option>
                {plantations.map((plantation) => (
                  <option key={plantation.id} value={plantation.id}>
                    {plantation.seedName}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Note content
              <textarea
                value={form.content}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, content: event.target.value }))
                }
                rows={6}
                placeholder="Share observations, insights, or updates about this plantation..."
                className="mt-1 w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                required
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Tags (optional)
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={form.tagInput}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, tagInput: event.target.value }))
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag and press Enter"
                  className="flex-1 rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="rounded-full border border-slate-600/40 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-200/90 transition hover:border-slate-400/60 hover:text-white"
                >
                  Add
                </button>
              </div>
            </label>

            {form.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <li
                    key={tag}
                    className="flex items-center gap-2 rounded-full border border-leaf-400/40 bg-leaf-500/10 px-2 py-1 text-xs text-leaf-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          tags: prev.tags.filter((t) => t !== tag),
                        }))
                      }
                      className="text-leaf-300 hover:text-leaf-100"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400/70">
              Attachment URL (optional)
              <div className="mt-1 flex gap-2">
                <input
                  type="url"
                  value={form.attachmentUrl}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      attachmentUrl: event.target.value,
                    }))
                  }
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="rounded-full border border-slate-600/40 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-200/90 transition hover:border-slate-400/60 hover:text-white"
                >
                  Add
                </button>
              </div>
            </label>

            {form.attachments.length > 0 && (
              <ul className="flex flex-wrap gap-2 text-xs text-slate-300/80">
                {form.attachments.map((url) => (
                  <li
                    key={url}
                    className="flex items-center gap-2 rounded-full border border-slate-700/40 bg-slate-900/60 px-2 py-1"
                  >
                    <span className="truncate max-w-[180px]">{url}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          attachments: prev.attachments.filter((u) => u !== url),
                        }))
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              disabled={!address || !form.plantationId || !form.content.trim()}
              className="w-full rounded-full bg-leaf-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-300 focus:ring-offset-2 focus:ring-offset-slate-900/60 disabled:cursor-not-allowed disabled:bg-slate-700/40 disabled:text-slate-300/60"
            >
              Add note
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300/70">
            Notes ({filteredNotes.length})
          </h3>
          {filteredNotes.length === 0 ? (
            <p className="text-sm text-slate-300/80">
              No notes yet. Add the first note to start collaborating!
            </p>
          ) : (
            <ul className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredNotes.map((note) => {
                const plantation = plantations.find(
                  (p) => p.id === note.plantationId
                );
                const isAuthor = note.authorWalletAddress === address;
                const isEditing = editingNoteId === note.id;

                return (
                  <li
                    key={note.id}
                    className="rounded-2xl border border-slate-700/40 bg-slate-900/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-white">
                            {getAuthorName(note)}
                          </p>
                          {plantation && (
                            <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300/70">
                              {plantation.seedName}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400/70">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {isEditing ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={editContent}
                              onChange={(event) =>
                                setEditContent(event.target.value)
                              }
                              rows={3}
                              className="w-full rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="rounded-full bg-leaf-500 px-3 py-1 text-xs font-semibold text-slate-950 transition hover:bg-leaf-400"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(null);
                                  setEditContent("");
                                }}
                                className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-200/90 transition hover:bg-slate-700/80"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-sm text-slate-200 whitespace-pre-wrap">
                            {note.content}
                          </p>
                        )}
                        {note.tags && note.tags.length > 0 && (
                          <ul className="mt-2 flex flex-wrap gap-1">
                            {note.tags.map((tag) => (
                              <li
                                key={tag}
                                className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300/70"
                              >
                                #{tag}
                              </li>
                            ))}
                          </ul>
                        )}
                        {note.attachments && note.attachments.length > 0 && (
                          <ul className="mt-2 flex flex-wrap gap-2">
                            {note.attachments.map((url, idx) => (
                              <li key={idx}>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-leaf-300 underline hover:text-leaf-200"
                                >
                                  View attachment
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {isAuthor && !isEditing && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleStartEdit(note.id, note.content)
                            }
                            className="rounded-full bg-slate-800/70 px-2 py-1 text-xs font-semibold text-slate-200/90 transition hover:bg-slate-700/80"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSharedNote(note.id)}
                            className="rounded-full bg-rose-600/20 px-2 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-600/30"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </motion.section>
  );
}

