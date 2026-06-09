import { create } from 'zustand';

import { createNote as createNoteRecord, listNotes } from '@/db/repositories/note-repository';
import type { CreateNoteInput, Note } from '@/types/notes/note.types';

type NoteStore = {
  notes: Note[];
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  createNote: (input: CreateNoteInput) => Promise<Note>;
};

let hydratePromise: Promise<void> | null = null;

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  isHydrated: false,
  isLoading: false,
  error: null,

  hydrate: async () => {
    if (get().isHydrated) {
      return;
    }

    if (hydratePromise) {
      return hydratePromise;
    }

    hydratePromise = (async () => {
      set({ isLoading: true, error: null });

      try {
        const notes = await listNotes();
        set({ notes, isHydrated: true, isLoading: false, error: null });
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load notes.',
        });
      } finally {
        hydratePromise = null;
      }
    })();

    return hydratePromise;
  },

  createNote: async (input: CreateNoteInput) => {
    try {
      const note = await createNoteRecord(input);
      set({ notes: [note, ...get().notes], error: null });
      return note;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create note.';
      set({ error: message });
      throw error;
    }
  },
}));
