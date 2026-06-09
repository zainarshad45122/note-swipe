import { useCallback, useEffect, useRef } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

import type { ColorSwatchOption } from '@/components/color-swatch-row';
import { useNoteSheetStore } from '@/stores/use-note-sheet-store';
import type { Note } from '@/types/notes/note.types';

type UseNoteSheetControllerParams = {
  colorOptions: ColorSwatchOption[];
  loadDraftFromNote: (note: Note) => void;
  resetDraft: () => void;
  resetEditorContent: () => void;
  resetEditorReady: () => void;
  clearPickers: () => void;
  clearSubmitError: () => void;
  onDismissComplete: () => void;
};

export function useNoteSheetController({
  colorOptions,
  loadDraftFromNote,
  resetDraft,
  resetEditorContent,
  resetEditorReady,
  clearPickers,
  clearSubmitError,
  onDismissComplete,
}: UseNoteSheetControllerParams) {
  const modalRef = useRef<BottomSheetModal>(null);
  const openRequestId = useNoteSheetStore((state) => state.openRequestId);
  const sheetMode = useNoteSheetStore((state) => state.mode);
  const editingNote = useNoteSheetStore((state) => state.editingNote);
  const resetAfterDismiss = useNoteSheetStore((state) => state.resetAfterDismiss);
  const requestOpenCreate = useNoteSheetStore((state) => state.requestOpenCreate);
  const isEditMode = sheetMode === 'edit';

  const handleDismiss = useCallback(() => {
    resetEditorReady();
    clearPickers();
    clearSubmitError();
    resetAfterDismiss();
    resetDraft();
    resetEditorContent();
    modalRef.current?.dismiss();
    onDismissComplete();
  }, [
    clearPickers,
    clearSubmitError,
    onDismissComplete,
    resetAfterDismiss,
    resetDraft,
    resetEditorContent,
    resetEditorReady,
  ]);

  useEffect(() => {
    if (openRequestId === 0) {
      return;
    }

    const { mode, editingNote: noteToEdit } = useNoteSheetStore.getState();
    const openingInEditMode = mode === 'edit';

    resetEditorReady();
    clearSubmitError();

    if (openingInEditMode && noteToEdit) {
      loadDraftFromNote(noteToEdit);
    } else {
      resetDraft();
      resetEditorContent();
    }

    modalRef.current?.present();
  }, [
    clearSubmitError,
    colorOptions,
    loadDraftFromNote,
    openRequestId,
    resetDraft,
    resetEditorContent,
    resetEditorReady,
  ]);

  return {
    modalRef,
    isEditMode,
    editingNote,
    handleDismiss,
    requestOpenCreate,
  };
}
