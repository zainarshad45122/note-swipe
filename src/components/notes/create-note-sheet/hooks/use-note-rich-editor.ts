import { useCallback, useEffect, useRef, useState } from 'react';
import { actions, type RichEditorHandle } from 'react-native-pell-rich-editor';

import { useNoteSheetStore } from '@/stores/use-note-sheet-store';

type UseNoteRichEditorParams = {
  selectedNoteColor: string;
  themeText: string;
};

export function useNoteRichEditor({ selectedNoteColor, themeText }: UseNoteRichEditorParams) {
  const sheetMode = useNoteSheetStore((state) => state.mode);
  const editingNote = useNoteSheetStore((state) => state.editingNote);
  const isEditMode = sheetMode === 'edit';
  const richTextRef = useRef<RichEditorHandle | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const applyNoteTextColor = useCallback((color: string) => {
    const editor = richTextRef.current;

    if (!editor) {
      return;
    }

    editor.setContentStyle({ color });
    editor.showAndroidKeyboard();
    editor.sendAction(actions.foreColor, 'result', color);
  }, []);

  const resetEditorContent = useCallback(() => {
    richTextRef.current?.setContentHTML('');
  }, []);

  const handleEditorInitialized = useCallback(() => {
    setIsEditorReady(true);
  }, []);

  const resetEditorReady = useCallback(() => {
    setIsEditorReady(false);
  }, []);

  useEffect(() => {
    if (!isEditorReady || isEditMode) {
      return;
    }

    applyNoteTextColor(selectedNoteColor);
  }, [applyNoteTextColor, isEditMode, isEditorReady, selectedNoteColor]);

  useEffect(() => {
    if (!isEditorReady || !isEditMode || !editingNote) {
      return;
    }

    richTextRef.current?.setContentHTML(editingNote.content);
    richTextRef.current?.setContentStyle({
      color: editingNote.textColor ?? themeText,
    });
  }, [editingNote, isEditMode, isEditorReady, themeText]);

  const editorKey = isEditMode ? `edit-${editingNote?.id ?? 'unknown'}` : 'create';
  const initialContentHTML = isEditMode ? (editingNote?.content ?? '') : '';

  return {
    richTextRef,
    isEditorReady,
    editorKey,
    initialContentHTML,
    applyNoteTextColor,
    resetEditorContent,
    handleEditorInitialized,
    resetEditorReady,
  };
}
