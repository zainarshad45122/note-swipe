import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlusIcon, SearchIcon } from '@/components/icons';
import { NotebookRow } from '@/components/notebook-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomNavHeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  CreateNotebookSheet,
  type CreateNotebookSheetHandle,
} from '@/screens/notebooks/create-notebook-sheet';
import { useNotebookStore } from '@/stores/use-notebook-store';
import type { Notebook } from '@/types/notebooks/notebook.types';
export function NotebooksScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const createNotebookSheetRef = useRef<CreateNotebookSheetHandle>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const notebooks = useNotebookStore((state) => state.notebooks);
  const isHydrated = useNotebookStore((state) => state.isHydrated);
  const isLoading = useNotebookStore((state) => state.isLoading);
  const error = useNotebookStore((state) => state.error);
  const createNotebook = useNotebookStore((state) => state.createNotebook);

  const filteredNotebooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return notebooks;
    }

    return notebooks.filter((notebook) => notebook.title.toLowerCase().includes(query));
  }, [notebooks, searchQuery]);

  const notebookCountLabel = useMemo(() => {
    const count = notebooks.length;
    return `${count} ${count === 1 ? 'notebook' : 'notebooks'}`;
  }, [notebooks.length]);

  const handleOpenCreateSheet = useCallback(() => {
    createNotebookSheetRef.current?.present();
  }, []);

  const handleCreateNotebook = useCallback(
    async (title: string) => {
      await createNotebook(title);
    },
    [createNotebook],
  );

  const renderNotebook = useCallback<ListRenderItem<Notebook>>(
    ({ item }) => (
      <NotebookRow
        title={item.title}
        noteCount={item.noteCount}
        onPress={() => {
          // Notebook detail is intentionally static for now.
        }}
      />
    ),
    [],
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.listHeader}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <ThemedText style={styles.screenTitle}>Notebooks</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.screenSubtitle}>
              {notebookCountLabel}
            </ThemedText>
          </View>

          <Pressable
            style={[
              styles.addButton,
              {
                backgroundColor: theme.notebookIconBackground,
                borderColor: theme.navBarBorder,
              },
            ]}
            onPress={handleOpenCreateSheet}
            accessibilityLabel="Create notebook"
          >
            <PlusIcon color={theme.navActive} size={22} />
          </Pressable>
        </View>

        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.sheetSurface,
              borderColor: theme.navBarBorder,
            },
          ]}
        >
          <SearchIcon color={theme.searchMuted} size={20} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notebooks"
            placeholderTextColor={theme.searchMuted}
            style={[styles.searchInput, { color: theme.text }]}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {error ? (
          <ThemedText themeColor="textSecondary" style={styles.errorText}>
            {error}
          </ThemedText>
        ) : null}
      </View>
    ),
    [
      error,
      handleOpenCreateSheet,
      notebookCountLabel,
      searchQuery,
      theme.navActive,
      theme.navBarBorder,
      theme.notebookIconBackground,
      theme.searchMuted,
      theme.sheetSurface,
      theme.text,
      theme.textSecondary,
    ],
  );

  if (!isHydrated && isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator color={theme.navActive} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredNotebooks}
        keyExtractor={(item) => item.id}
        renderItem={renderNotebook}
        ListHeaderComponent={listHeader}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: insets.top + Spacing.three,
            paddingBottom: BottomNavHeight + Spacing.four,
          },
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      <CreateNotebookSheet ref={createNotebookSheetRef} onCreateNotebook={handleCreateNotebook} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.three,
  },
  listHeader: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  headerTextBlock: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
  },
  screenSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: Spacing.one,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    padding: 0,
  },
  separator: {
    height: Spacing.three,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
