/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    sheetSurface: '#F5F3FA',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    accent: '#9333EA',
    pillBackground: 'rgba(0, 0, 0, 0.05)',
    pillBorder: 'rgba(0, 0, 0, 0.1)',
    navBar: '#FFFFFF',
    navBarBorder: 'rgba(0, 0, 0, 0.1)',
    navActive: '#9333EA',
    fabGradientStart: '#E879F9',
    fabGradientEnd: '#8B5CF6',
    fabForeground: '#FFFFFF',
    fabShadow: '#9333EA',
    shadow: '#000000',
    editorToolbarBackground: '#F3F4F6',
    editorToolbarText: '#111827',
    notebookIconBackground: '#EDE9FE',
    colorIconBackground: '#FFEDD5',
    colorIconForeground: '#EA580C',
    roundButtonBackground: '#F3F4F6',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    sheetSurface: '#121214',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    accent: '#9333EA',
    pillBackground: 'rgba(255, 255, 255, 0.08)',
    pillBorder: 'rgba(255, 255, 255, 0.14)',
    navBar: '#212225',
    navBarBorder: 'rgba(255, 255, 255, 0.1)',
    navActive: '#C084FC',
    fabGradientStart: '#E879F9',
    fabGradientEnd: '#8B5CF6',
    fabForeground: '#FFFFFF',
    fabShadow: '#8B5CF6',
    shadow: '#000000',
    editorToolbarBackground: '#1B1C20',
    editorToolbarText: '#F8FAFC',
    notebookIconBackground: 'rgba(147, 51, 234, 0.18)',
    colorIconBackground: 'rgba(234, 88, 12, 0.18)',
    colorIconForeground: '#FB923C',
    roundButtonBackground: '#2E3135',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomNavHeight = 100;

export const CardShadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: {
    elevation: 3,
  },
  default: {},
})!;

export const EditorCardShadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  android: {
    elevation: 1,
  },
  default: {},
})!;
