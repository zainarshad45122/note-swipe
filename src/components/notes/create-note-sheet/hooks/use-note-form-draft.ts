import { useCallback, useMemo, useState } from 'react';

import { stripHtmlToText } from '@/components/notes/note-content';
import type { Note } from '@/types/notes/note.types';

import { findColorIndex } from '@/components/notes/create-note-sheet/utils';
import type { ColorSwatchOption } from '@/components/color-swatch-row';

export type NoteFormDraft = {
  htmlContent: string;
  notebookId: string;
  notebookName: string;
  selectedColorIndex: number;
};

type UseNoteFormDraftParams = {
  defaultNotebookId?: string;
  defaultNotebookName: string;
  colorOptions: ColorSwatchOption[];
};

export function useNoteFormDraft({
  defaultNotebookId,
  defaultNotebookName,
  colorOptions,
}: UseNoteFormDraftParams) {
  const [draft, setDraft] = useState<NoteFormDraft>(() => ({
    htmlContent: '',
    notebookId: defaultNotebookId ?? '',
    notebookName: defaultNotebookName,
    selectedColorIndex: 0,
  }));

  const setHtmlContent = useCallback((htmlContent: string) => {
    setDraft((current) => ({ ...current, htmlContent }));
  }, []);

  const setSelectedColorIndex = useCallback((selectedColorIndex: number) => {
    setDraft((current) => ({ ...current, selectedColorIndex }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft({
      htmlContent: '',
      notebookId: defaultNotebookId ?? '',
      notebookName: defaultNotebookName,
      selectedColorIndex: 0,
    });
  }, [defaultNotebookId, defaultNotebookName]);

  const loadDraftFromNote = useCallback(
    (note: Note) => {
      setDraft({
        htmlContent: note.content,
        notebookId: note.notebookId,
        notebookName: note.notebookName ?? 'Personal',
        selectedColorIndex: findColorIndex(note.textColor, colorOptions),
      });
    },
    [colorOptions],
  );

  const plainText = useMemo(() => stripHtmlToText(draft.htmlContent), [draft.htmlContent]);
  const characterCount = plainText.length;

  return {
    draft,
    characterCount,
    plainText,
    setHtmlContent,
    setSelectedColorIndex,
    resetDraft,
    loadDraftFromNote,
  };
}
