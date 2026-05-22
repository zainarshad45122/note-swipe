import { StyleSheet, View } from 'react-native';

import { Note } from '@/components/notes';
import { ThemedView } from '@/components/themed-view';
import { BottomNavHeight, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.noteWrapper}>
        <Note
          notebookName="Startup Ideas"
          title="Quick capture"
          content="Build a feature where users can shuffle old forgotten notes like memory rediscovery."
          createdAt={new Date()}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomNavHeight + Spacing.three,
  },
  noteWrapper: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
});
