import type { ColorSwatchOption } from '@/components/color-swatch-row';

export function findColorIndex(
  color: string | undefined,
  colorOptions: ColorSwatchOption[],
): number {
  if (!color) {
    return 0;
  }

  const index = colorOptions.findIndex(
    (option) => option.color.toLowerCase() === color.toLowerCase(),
  );

  return index >= 0 ? index : 0;
}
