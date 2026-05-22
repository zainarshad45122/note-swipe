/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors, type ThemeColor } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Shared palette shape — light and dark use the same keys, different values. */
export type Theme = Record<ThemeColor, string>;

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const themeKey = scheme === 'unspecified' ? 'light' : scheme;

  return Colors[themeKey];
}
