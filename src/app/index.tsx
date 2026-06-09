import { useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { NoteDeck, type NoteDeckItem } from '@/components/notes/note-deck';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomNavHeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useNoteSheetStore } from '@/stores/use-note-sheet-store';
import { useNoteStore } from '@/stores/use-note-store';

export default function HomeScreen() {
  const theme = useTheme();
  const notes = useNoteStore((state) => state.notes);
  const isHydrated = useNoteStore((state) => state.isHydrated);
  const isLoading = useNoteStore((state) => state.isLoading);
  const requestOpenEdit = useNoteSheetStore((state) => state.requestOpenEdit);

  const deckNotes = useMemo<NoteDeckItem[]>(
    () =>
      notes.map((note) => ({
        id: note.id,
        content: note.content,
        textColor: note.textColor,
        notebookId: note.notebookId,
        notebookName: note.notebookName,
        createdAt: note.createdAt,
      })),
    [notes],
  );

  const handleNotePress = useCallback(
    (deckNote: NoteDeckItem) => {
      const note = notes.find((item) => item.id === deckNote.id);
      if (note) {
        requestOpenEdit(note);
      }
    },
    [notes, requestOpenEdit],
  );

  if (!isHydrated && isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator color={theme.navActive} />
      </ThemedView>
    );
  }

  if (deckNotes.length === 0) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText themeColor="textSecondary" style={styles.emptyText}>
          No notes yet. Tap + to create your first note.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <NoteDeck notes={deckNotes} onNotePress={handleNotePress} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: BottomNavHeight + Spacing.three,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
