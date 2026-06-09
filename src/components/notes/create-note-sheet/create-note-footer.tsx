import { type RefObject } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import type { RichEditorHandle } from 'react-native-pell-rich-editor';

import { CreateNoteIcon } from '@/components/icons';
import { NOTE_CHARACTER_LIMIT } from '@/components/notes/create-note-sheet/constants';
import { CreateNoteEditorToolbar } from '@/components/notes/create-note-editor-toolbar';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Theme } from '@/hooks/use-theme';

type CreateNoteFooterProps = {
  characterCount: number;
  editorRef: RefObject<RichEditorHandle | null>;
  editorReady: boolean;
  isEditMode: boolean;
  isSaving: boolean;
  submitError: string | null;
  theme: Theme;
  onLayout: (event: LayoutChangeEvent) => void;
  onSubmit: () => void;
};

export function CreateNoteFooter({
  characterCount,
  editorRef,
  editorReady,
  isEditMode,
  isSaving,
  submitError,
  theme,
  onLayout,
  onSubmit,
}: CreateNoteFooterProps) {
  const submitLabel = isEditMode ? 'Update' : isSaving ? 'Creating...' : 'Create Note';

  return (
    <View style={styles.bottomChrome} onLayout={onLayout}>
      <View style={styles.editorChrome}>
        <View style={styles.editorFooter}>
          <ThemedText themeColor="textSecondary" style={styles.characterCount}>
            {characterCount} / {NOTE_CHARACTER_LIMIT}
          </ThemedText>
        </View>
        <CreateNoteEditorToolbar
          editorRef={editorRef}
          editorReady={editorReady}
          theme={theme}
          borderColor={theme.navBarBorder}
          backgroundColor={theme.background}
        />
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.createButton, { backgroundColor: theme.accent }]}
          onPress={onSubmit}
          disabled={isSaving}
        >
          <CreateNoteIcon color={theme.fabForeground} size={20} />
          <ThemedText style={[styles.createButtonText, { color: theme.fabForeground }]}>
            {submitLabel}
          </ThemedText>
        </Pressable>
        {submitError ? (
          <ThemedText themeColor="textSecondary" style={styles.errorText}>
            {submitError}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomChrome: {
    flexShrink: 0,
  },
  editorChrome: {
    flexShrink: 0,
  },
  editorFooter: {
    alignItems: 'flex-end',
    paddingTop: Spacing.one,
    paddingBottom: Spacing.one,
  },
  characterCount: {
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    flexShrink: 0,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },
  createButton: {
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginBottom: 16,
  },
  createButtonText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
