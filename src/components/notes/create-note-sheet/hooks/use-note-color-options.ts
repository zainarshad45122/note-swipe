import { useMemo } from 'react';

import type { ColorSwatchOption } from '@/components/color-swatch-row';

import { NOTE_ACCENT_COLORS } from '@/components/notes/create-note-sheet/constants';

export function useNoteColorOptions(themeText: string) {
  return useMemo<ColorSwatchOption[]>(
    () => [
      { key: 'default', color: themeText, isDefault: true },
      ...NOTE_ACCENT_COLORS.map((color, index) => ({
        key: `accent-${index}`,
        color,
        isDefault: false,
      })),
    ],
    [themeText],
  );
}
