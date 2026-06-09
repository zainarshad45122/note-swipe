import { create } from 'zustand';

import { createNote as createNoteRecord } from '@/db/repositories/note-repository';
import type { CreateNoteInput, Note } from '@/types/notes/note.types';

type NoteStore = {
  notes: Note[];
  error: string | null;
  createNote: (input: CreateNoteInput) => Promise<Note>;
};

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  error: null,

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
