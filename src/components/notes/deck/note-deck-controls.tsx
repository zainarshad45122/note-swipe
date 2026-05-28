import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type NoteDeckControlsProps = {
  atFirst: boolean;
  atLast: boolean;
  currentIndex: number;
  noteCount: number;
  onNext: () => void;
  onPrevious: () => void;
};

export function NoteDeckControls({
  atFirst,
  atLast,
  currentIndex,
  noteCount,
  onNext,
  onPrevious,
}: NoteDeckControlsProps) {
  const theme = useTheme();

  return (
    <View style={styles.controls}>
      <Pressable
        onPress={onPrevious}
        disabled={atFirst}
        style={({ pressed }) => [
          styles.controlButton,
          { backgroundColor: theme.backgroundElement, borderColor: theme.pillBorder },
          atFirst && styles.controlButtonDisabled,
          pressed && !atFirst && styles.controlButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Previous note"
      >
        <Text style={[styles.controlLabel, { color: theme.text }]}>Prev</Text>
      </Pressable>

      <Text style={[styles.indexLabel, { color: theme.textSecondary }]}>
        {noteCount === 0 ? '—' : `${currentIndex + 1} / ${noteCount}`}
      </Text>

      <Pressable
        onPress={onNext}
        disabled={atLast}
        style={({ pressed }) => [
          styles.controlButton,
          { backgroundColor: theme.backgroundElement, borderColor: theme.pillBorder },
          atLast && styles.controlButtonDisabled,
          pressed && !atLast && styles.controlButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Next note"
      >
        <Text style={[styles.controlLabel, { color: theme.text }]}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    marginTop: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  controlButton: {
    minWidth: 72,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  controlButtonPressed: {
    opacity: 0.75,
  },
  controlButtonDisabled: {
    opacity: 0.35,
  },
  controlLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  indexLabel: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 48,
    textAlign: 'center',
  },
});
