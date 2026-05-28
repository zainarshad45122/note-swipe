import { Platform, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { NoteSurfaceProps } from '@/types/notes/note.types';

export function NoteSurface({ children, style }: NoteSurfaceProps) {
  return (
    <ThemedView type="backgroundElement" style={[styles.surface, styles.shadow, style]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  surface: {
    flexDirection: 'column',
    borderRadius: 28,
    padding: Spacing.four,
    minHeight: 400,
    overflow: 'hidden',
  },
  shadow:
    Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }) ?? {},
});
