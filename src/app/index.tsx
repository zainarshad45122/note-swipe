import { StyleSheet } from 'react-native';

import { NoteDeck, type NoteDeckItem } from '@/components/notes/note-deck';
import { ThemedView } from '@/components/themed-view';
import { BottomNavHeight, Spacing } from '@/constants/theme';

const MOCK_NOTES: NoteDeckItem[] = [
  {
    id: '1',
    notebookName: 'Startup Ideas',
    title: 'Quick capture',
    content: 'Build a feature where users can shuffle old forgotten notes like memory rediscovery.',
    createdAt: new Date(),
  },
  {
    id: '2',
    notebookName: 'Journal',
    content: 'Write down one small win from today before bed.',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    notebookName: 'Reminders',
    title: 'Call back',
    content: 'Follow up with the designer about the home screen carousel.',
    createdAt: new Date(Date.now() - 172800000),
  },
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <NoteDeck notes={MOCK_NOTES} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: BottomNavHeight + Spacing.three,
  },
});
