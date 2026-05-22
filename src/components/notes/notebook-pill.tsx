import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type NotebookPillProps = {
  name: string;
};

export function NotebookPill({ name }: NotebookPillProps) {
  return (
    <ThemedView type="pillBackground" borderType="pillBorder" style={styles.pill}>
      <ThemedView type="accent" style={styles.dot} />
      <ThemedText type="small" numberOfLines={1} style={styles.label}>
        {name}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    flexShrink: 1,
  },
});
