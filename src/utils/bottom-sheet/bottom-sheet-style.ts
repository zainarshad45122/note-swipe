import { Platform, StyleSheet } from 'react-native';

import type { Theme } from '@/hooks/use-theme';

const SHEET_SHADOW = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  android: {
    elevation: 16,
  },
  default: {},
})!;

export function createBottomSheetBackgroundStyle(theme: Theme) {
  return [
    styles.sheetBackground,
    SHEET_SHADOW,
    {
      backgroundColor: theme.sheetSurface,
      borderColor: theme.navBarBorder,
    },
  ];
}

export const BOTTOM_SHEET_BACKDROP_OPACITY = 0.55;

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
});
