import { CARD_GAP_RATIO, CARD_WIDTH_RATIO, OVERSCAN_NOTES } from '@/components/notes/deck/note-deck.constants';
import type { DeckLayout, NoteDeckItem, VisibleDeckNote } from '@/types/notes/note-deck.types';

export function clampIndex(index: number, count: number) {
  if (count <= 0) return 0;
  return Math.max(0, Math.min(count - 1, index));
}

export function getDeckLayout(screenWidth: number): DeckLayout {
  const cardWidth = screenWidth * CARD_WIDTH_RATIO;
  const cardGap = screenWidth * CARD_GAP_RATIO;
  const sidePeek = (screenWidth - cardWidth) / 2;
  const snapDistance = cardWidth + cardGap;

  return {
    cardWidth,
    cardGap,
    snapDistance,
    sidePeek,
    screenWidth,
  };
}

export function getVisibleNotes(notes: NoteDeckItem[], windowCenterIndex: number): VisibleDeckNote[] {
  const startIndex = Math.max(0, windowCenterIndex - OVERSCAN_NOTES);
  const endIndex = Math.min(notes.length - 1, windowCenterIndex + OVERSCAN_NOTES);

  return notes.slice(startIndex, endIndex + 1).map((note, sliceIndex) => ({
    note,
    index: startIndex + sliceIndex,
  }));
}

export function getVirtualPaddingLeft(
  sidePeek: number,
  visibleNotes: VisibleDeckNote[],
  snapDistance: number,
) {
  return sidePeek + (visibleNotes[0]?.index ?? 0) * snapDistance;
}
