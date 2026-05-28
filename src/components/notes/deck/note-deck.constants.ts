import type { WithSpringConfig } from 'react-native-reanimated';

/** Main card is wide while leaving enough room for recognizable peek cards at both edges. */
export const CARD_WIDTH_RATIO = 0.7;

/** Horizontal breathing room between the active card and peek cards. */
export const CARD_GAP_RATIO = 0.04;

/** How the strip snaps onto a card (buttons + finger release). */
export const SNAP_SPRING: WithSpringConfig = {
  damping: 22,
  stiffness: 380,
  mass: 0.75,
  overshootClamping: true,
};

/** How much you can pull past the first/last note (0 = hard stop, 1 = no resistance). */
export const RUBBER_BAND_FACTOR = 0.35;

/** Drag past this fraction of a card width → commit to the next/previous card. */
export const SNAP_COMMIT_RATIO = 0.3;

/** Fast horizontal flick still changes card even with a short drag. */
export const FLING_VELOCITY = 400;

/** Extra notes mounted on each side so mid-drag / mid-spring never show a blank slot. */
export const OVERSCAN_NOTES = 2;

export const SIDE_CARD_SCALE = 0.92;
export const SIDE_CARD_OPACITY = 0.82;
export const SIDE_CARD_ROTATION_DEG = 2.5;

export const PAN_ACTIVE_OFFSET = 12;
export const PAN_FAIL_OFFSET = 12;
