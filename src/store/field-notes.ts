import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type FieldNoteCategory =
  | "observation"
  | "issue"
  | "improvement"
  | "weather"
  | "pest_disease"
  | "harvest"
  | "other";

export type FieldNote = {
  id: string;
  plantationId: string;
  category: FieldNoteCategory;
  title: string;
  content: string;
  author?: string;
  date: string;
  location?: string;
  photos?: string[];
  tags: string[];
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
};

export type FieldNoteDraft = Omit<
  FieldNote,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

type FieldNotesState = {
  notes: FieldNote[];
  addNote: (draft: FieldNoteDraft) => void;
  updateNote: (id: string, updates: Partial<FieldNoteDraft>) => void;
  removeNote: (id: string) => void;
  getNotesByPlantation: (plantationId: string) => FieldNote[];
  getNotesByCategory: (category: FieldNoteCategory) => FieldNote[];
  searchNotes: (query: string) => FieldNote[];
};

const generateNoteId = () =>
  `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useFieldNotesStore = create<FieldNotesState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (draft) => {
        const now = new Date().toISOString();
        const note: FieldNote = {
          ...draft,
          id: draft.id ?? generateNoteId(),
          tags: draft.tags || [],
          photos: draft.photos || [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          notes: [...state.notes, note],
        }));
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      removeNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      getNotesByPlantation: (plantationId) => {
        return get()
          .notes.filter((note) => note.plantationId === plantationId)
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      },

      getNotesByCategory: (category) => {
        return get()
          .notes.filter((note) => note.category === category)
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      },

      searchNotes: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().notes.filter(
          (note) =>
            note.title.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery) ||
            note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: "cocoa-chain-field-notes",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<FieldNotesState>
  )
);

