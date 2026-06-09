import { useCallback, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { cancelAnimation, runOnJS, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import {
  PAN_ACTIVE_OFFSET,
  PAN_FAIL_OFFSET,
  RUBBER_BAND_FACTOR,
  SNAP_SPRING,
} from '@/components/notes/deck/note-deck.constants';
import { clampIndex } from '@/components/notes/deck/note-deck.math';
import { resolveSnapIndex } from '@/components/notes/deck/note-deck.snap';
import type { DeckLayout, NoteDeckMotionValues } from '@/types/notes/note-deck.types';

type UseNoteDeckGestureParams = {
  layout: DeckLayout;
  motion: NoteDeckMotionValues;
  noteCount: number;
  commitSettledIndex: (index: number) => void;
  commitWindowCenterIndex: (index: number) => void;
};

export function useNoteDeckGesture({
  layout,
  motion,
  noteCount,
  commitSettledIndex,
  commitWindowCenterIndex,
}: UseNoteDeckGestureParams) {
  const { snapDistance } = layout;
  const {
    scrollX,
    panStartX,
    maxScrollX,
    snapDistanceShared,
    maxIndexShared,
    windowCenterIndexShared,
  } = motion;

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -scrollX.value }],
  }));

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-PAN_ACTIVE_OFFSET, PAN_ACTIVE_OFFSET])
        .failOffsetY([-PAN_FAIL_OFFSET, PAN_FAIL_OFFSET])
        .onStart(() => {
          'worklet';
          const snap = snapDistanceShared.value;
          cancelAnimation(scrollX);

          if (snap > 0) {
            const snappedIndex = Math.max(
              0,
              Math.min(maxIndexShared.value, Math.round(scrollX.value / snap)),
            );
            scrollX.value = snappedIndex * snap;
            panStartX.value = scrollX.value;

            if (snappedIndex !== windowCenterIndexShared.value) {
              windowCenterIndexShared.value = snappedIndex;
              runOnJS(commitWindowCenterIndex)(snappedIndex);
            }
          } else {
            panStartX.value = 0;
          }
        })
        .onUpdate((event) => {
          const next = panStartX.value - event.translationX;
          const min = 0;
          const max = maxScrollX.value;
          const factor = RUBBER_BAND_FACTOR;
          if (next < min) {
            scrollX.value = min - (min - next) * factor;
          } else if (next > max) {
            scrollX.value = max + (next - max) * factor;
          } else {
            scrollX.value = next;
          }

          const snap = snapDistanceShared.value;
          if (snap > 0) {
            const nextWindowCenterIndex = Math.max(
              0,
              Math.min(maxIndexShared.value, Math.round(scrollX.value / snap)),
            );

            if (nextWindowCenterIndex !== windowCenterIndexShared.value) {
              windowCenterIndexShared.value = nextWindowCenterIndex;
              runOnJS(commitWindowCenterIndex)(nextWindowCenterIndex);
            }
          }
        })
        .onEnd((event) => {
          'worklet';
          const snap = snapDistanceShared.value;
          if (snap <= 0) {
            runOnJS(commitSettledIndex)(0);
            return;
          }

          const targetIndex = resolveSnapIndex(
            scrollX.value,
            snap,
            maxIndexShared.value,
            event.velocityX,
          );
          const targetX = targetIndex * snap;

          scrollX.value = withSpring(
            targetX,
            {
              ...SNAP_SPRING,
              velocity: -event.velocityX,
            },
            () => {
              'worklet';
              scrollX.value = targetX;
              runOnJS(commitSettledIndex)(targetIndex);
            },
          );
        }),
    [
      commitSettledIndex,
      commitWindowCenterIndex,
      maxIndexShared,
      maxScrollX,
      panStartX,
      scrollX,
      snapDistanceShared,
      windowCenterIndexShared,
    ],
  );

  const goToIndex = useCallback(
    (index: number) => {
      const nextIndex = clampIndex(index, noteCount);
      const targetX = nextIndex * snapDistance;

      cancelAnimation(scrollX);
      windowCenterIndexShared.value = nextIndex;
      commitWindowCenterIndex(nextIndex);

      scrollX.value = withSpring(targetX, SNAP_SPRING, () => {
        'worklet';
        scrollX.value = targetX;
        runOnJS(commitSettledIndex)(nextIndex);
      });
    },
    [
      commitSettledIndex,
      commitWindowCenterIndex,
      noteCount,
      scrollX,
      snapDistance,
      windowCenterIndexShared,
    ],
  );

  const goToPrevious = useCallback(
    (currentIndex: number) => {
      goToIndex(currentIndex - 1);
    },
    [goToIndex],
  );

  const goToNext = useCallback(
    (currentIndex: number) => {
      goToIndex(currentIndex + 1);
    },
    [goToIndex],
  );

  return {
    goToNext,
    goToPrevious,
    panGesture,
    stripStyle,
  };
}
