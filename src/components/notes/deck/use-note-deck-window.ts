import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import {
  clampIndex,
  getVirtualPaddingLeft,
  getVisibleNotes,
} from '@/components/notes/deck/note-deck.math';
import type {
  DeckLayout,
  NoteDeckItem,
  NoteDeckMotionValues,
  VisibleDeckNote,
} from '@/types/notes/note-deck.types';

type UseNoteDeckWindowParams = {
  notes: NoteDeckItem[];
  layout: DeckLayout;
};

export function useNoteDeckWindow({ notes, layout }: UseNoteDeckWindowParams) {
  const { sidePeek, snapDistance } = layout;
  const initialMaxIndex = Math.max(0, notes.length - 1);

  const scrollX = useSharedValue(0);
  const panStartX = useSharedValue(0);
  const maxScrollX = useSharedValue(initialMaxIndex * snapDistance);
  const snapDistanceShared = useSharedValue(snapDistance);
  const maxIndexShared = useSharedValue(initialMaxIndex);
  const windowCenterIndexShared = useSharedValue(0);

  const [windowCenterIndex, setWindowCenterIndex] = useState(0);
  const currentWindowCenterIndex = clampIndex(windowCenterIndex, notes.length);

  useEffect(() => {
    const maxIndex = Math.max(0, notes.length - 1);
    const max = maxIndex * snapDistance;
    maxScrollX.value = max;
    snapDistanceShared.value = snapDistance;
    maxIndexShared.value = maxIndex;

    const clampedScroll = Math.min(scrollX.value, max);
    scrollX.value = clampedScroll;
    const index =
      snapDistance > 0 ? clampIndex(Math.round(clampedScroll / snapDistance), notes.length) : 0;
    windowCenterIndexShared.value = index;
    setWindowCenterIndex(index);
  }, [
    maxIndexShared,
    maxScrollX,
    notes.length,
    scrollX,
    snapDistance,
    snapDistanceShared,
    windowCenterIndexShared,
  ]);

  const commitWindowCenterIndex = useCallback(
    (index: number) => {
      setWindowCenterIndex(clampIndex(index, notes.length));
    },
    [notes.length],
  );

  const commitSettledIndex = useCallback(
    (index: number) => {
      const nextIndex = clampIndex(index, notes.length);
      const snap = snapDistanceShared.value;
      scrollX.value = nextIndex * snap;
      setWindowCenterIndex(nextIndex);
      windowCenterIndexShared.value = nextIndex;
    },
    [notes.length, scrollX, snapDistanceShared, windowCenterIndexShared],
  );

  const visibleNotes: VisibleDeckNote[] = useMemo(
    () => getVisibleNotes(notes, currentWindowCenterIndex),
    [currentWindowCenterIndex, notes],
  );

  const virtualPaddingLeft = getVirtualPaddingLeft(sidePeek, visibleNotes, snapDistance);

  const atFirst = currentWindowCenterIndex <= 0;
  const atLast = notes.length === 0 || currentWindowCenterIndex >= notes.length - 1;

  const motion: NoteDeckMotionValues = {
    scrollX,
    panStartX,
    maxScrollX,
    snapDistanceShared,
    maxIndexShared,
    windowCenterIndexShared,
  };

  return {
    atFirst,
    atLast,
    commitSettledIndex,
    commitWindowCenterIndex,
    currentWindowCenterIndex,
    motion,
    virtualPaddingLeft,
    visibleNotes,
  };
}
