import { FLING_VELOCITY, SNAP_COMMIT_RATIO } from '@/components/notes/deck/note-deck.constants';

/** Pick which card to land on after the finger lifts (runs on the UI thread). */
export function resolveSnapIndex(
  offsetX: number,
  snapDistance: number,
  maxIndex: number,
  velocityX: number,
) {
  'worklet';
  if (snapDistance <= 0 || maxIndex <= 0) {
    return 0;
  }

  const position = offsetX / snapDistance;
  const baseIndex = Math.floor(position);
  const drift = position - baseIndex;

  if (velocityX < -FLING_VELOCITY) {
    return Math.max(0, Math.min(maxIndex, Math.floor(position) + 1));
  }

  if (velocityX > FLING_VELOCITY) {
    return Math.max(0, Math.min(maxIndex, Math.ceil(position) - 1));
  }

  if (drift > SNAP_COMMIT_RATIO) {
    return Math.min(maxIndex, baseIndex + 1);
  }

  if (drift < 1 - SNAP_COMMIT_RATIO) {
    return baseIndex;
  }

  return Math.max(0, Math.min(maxIndex, Math.round(position)));
}
