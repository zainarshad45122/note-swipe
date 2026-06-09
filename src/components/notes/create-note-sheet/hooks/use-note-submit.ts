import { useCallback, useState } from 'react';

import type { NoteFormDraft } from '@/components/notes/create-note-sheet/hooks/use-note-form-draft';
import { useNoteStore } from '@/stores/use-note-store';

import { useNoteSheetStore } from '@/stores/use-note-sheet-store';

type UseNoteSubmitParams = {
  draft: NoteFormDraft;
  plainText: string;
  selectedNoteColor: string;
  onSuccess: () => void;
};

export function useNoteSubmit({
  draft,
  plainText,
  selectedNoteColor,
  onSuccess,
}: UseNoteSubmitParams) {
  const createNote = useNoteStore((state) => state.createNote);
  const isEditMode = useNoteSheetStore((state) => state.mode) === 'edit';
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clearSubmitError = useCallback(() => {
    setSubmitError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSaving || isEditMode) {
      return;
    }

    const trimmedNotebookId = draft.notebookId.trim();
    if (!trimmedNotebookId) {
      setSubmitError('Select a notebook before creating the note.');
      return;
    }

    setIsSaving(true);
    setSubmitError(null);

    try {
      await createNote({
        title: plainText.slice(0, 80),
        content: draft.htmlContent,
        textColor: selectedNoteColor,
        notebookId: trimmedNotebookId,
        notebookName: draft.notebookName,
      });
      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create note.');
    } finally {
      setIsSaving(false);
    }
  }, [createNote, draft, isEditMode, isSaving, onSuccess, plainText, selectedNoteColor]);

  return {
    isSaving,
    submitError,
    clearSubmitError,
    handleSubmit,
  };
}
