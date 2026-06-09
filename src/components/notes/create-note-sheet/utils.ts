import type { ColorSwatchOption } from '@/components/color-swatch-row';

export function findColorIndex(
  color: string | undefined,
  colorOptions: ColorSwatchOption[],
): number {
  if (!color) {
    return 0;
  }

  const normalized = color.toLowerCase();
  const matchIndex = colorOptions.findIndex((option) => option.color.toLowerCase() === normalized);
  return matchIndex >= 0 ? matchIndex : 0;
}
