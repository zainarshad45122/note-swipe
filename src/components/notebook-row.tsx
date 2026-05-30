import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronRightIcon, NotebookSelectIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type NotebookRowProps = {
  title: string;
  label?: string;
  noteCount?: number;
  onPress?: () => void;
};

export function NotebookRow({ title, label, noteCount, onPress }: NotebookRowProps) {
  const theme = useTheme();

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.notebookRowBackground,
            borderColor: theme.navBarBorder,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: theme.notebookIconBackground }]}>
          <NotebookSelectIcon color={theme.navActive} size={22} />
        </View>

        <View style={styles.textBlock}>
          {label ? (
            <ThemedText themeColor="textSecondary" style={styles.label}>
              {label}
            </ThemedText>
          ) : null}
          <ThemedText style={styles.title}>{title}</ThemedText>
        </View>

        {noteCount !== undefined ? (
          <ThemedText themeColor="textSecondary" style={styles.noteCount}>
            {noteCount} {noteCount === 1 ? 'note' : 'notes'}
          </ThemedText>
        ) : null}

        <ChevronRightIcon color={theme.textSecondary} size={20} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  noteCount: {
    fontSize: 13,
    lineHeight: 18,
    flexShrink: 0,
  },
});
