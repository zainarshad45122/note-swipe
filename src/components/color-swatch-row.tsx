import { Pressable, StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ColorSwatchOption = {
  key: string;
  color: string;
  isDefault: boolean;
};

type ColorSwatchRowProps = {
  colorOptions: ColorSwatchOption[];
  selectedColorIndex: number;
  onColorSelect: (index: number) => void;
};

export function ColorSwatchRow({
  colorOptions,
  selectedColorIndex,
  onColorSelect,
}: ColorSwatchRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.swatchRow}>
      {colorOptions.map(({ key, color, isDefault }, index) => {
        const isSelected = index === selectedColorIndex;

        return (
          <Pressable
            key={key}
            style={[styles.swatchWrap, isSelected && { borderColor: theme.navActive }]}
            onPress={() => onColorSelect(index)}
          >
            <View
              style={[
                styles.swatch,
                { backgroundColor: color },
                isDefault && {
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: theme.navBarBorder,
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  swatchWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});
