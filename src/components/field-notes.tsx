"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function FieldNotes() {
  const [notes, setNotes] = useState([
    {
      id: "1",
      plantation: "Cocoa Farm A",
      date: "2024-01-15",
      note: "Noticed some yellowing leaves in the northeast section. Applied fertilizer.",
      tags: ["maintenance", "fertilizer"],
    },
    {
      id: "2",
      plantation: "Cocoa Farm B",
      date: "2024-01-14",
      note: "Harvested 50kg of pods. Quality looks excellent this season.",
      tags: ["harvest", "quality"],
    },
    {
      id: "3",
      plantation: "Cocoa Farm C",
      date: "2024-01-13",
      note: "Irrigation system working well. Soil moisture levels optimal.",
      tags: ["irrigation", "soil"],
    },
  ]);

  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([
        {
          id: Date.now().toString(),
          plantation: "Current Farm",
          date: new Date().toISOString().split("T")[0],
          note: newNote,
          tags: [],
        },
        ...notes,
      ]);
      setNewNote("");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-cream-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cocoa-900">Field Notes</h2>
        <p className="text-xs uppercase tracking-[0.25em] text-cocoa-400">
          Record observations and notes
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addNote()}
          placeholder="Add a field note..."
          className="flex-1 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="button"
          onClick={addNote}
          className="rounded-xl border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          Add
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-xl border border-blue-200 bg-white/80 p-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-cocoa-900">
                    {note.plantation}
                  </h3>
                  <span className="text-xs text-cocoa-500">
                    {new Date(note.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-cocoa-700">{note.note}</p>
                {note.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
