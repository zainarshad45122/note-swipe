import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import type { TabTriggerSlotProps } from 'expo-router/ui';

import { useTheme } from '@/hooks/use-theme';

type NavTabItemProps = TabTriggerSlotProps & {
  label: string;
  renderIcon: (color: string) => ReactNode;
  slotStyle?: StyleProp<ViewStyle>;
};

export function NavTabItem({ label, renderIcon, slotStyle, isFocused, ...props }: NavTabItemProps) {
  const theme = useTheme();
  const color = isFocused ? theme.navActive : theme.textSecondary;

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.item, slotStyle, pressed && styles.pressed]}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
    >
      {renderIcon(color)}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 64,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
