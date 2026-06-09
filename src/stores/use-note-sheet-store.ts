import { create } from 'zustand';

import type { Note } from '@/types/notes/note.types';

export type NoteSheetMode = 'create' | 'edit';

type NoteSheetStore = {
  mode: NoteSheetMode;
  editingNote: Note | null;
  openRequestId: number;
  requestOpenCreate: () => void;
  requestOpenEdit: (note: Note) => void;
  resetAfterDismiss: () => void;
};

export const useNoteSheetStore = create<NoteSheetStore>((set) => ({
  mode: 'create',
  editingNote: null,
  openRequestId: 0,

  requestOpenCreate: () =>
    set((state) => ({
      mode: 'create',
      editingNote: null,
      openRequestId: state.openRequestId + 1,
    })),

  requestOpenEdit: (note) =>
    set((state) => ({
      mode: 'edit',
      editingNote: note,
      openRequestId: state.openRequestId + 1,
    })),

  resetAfterDismiss: () =>
    set({
      mode: 'create',
      editingNote: null,
    }),
}));
