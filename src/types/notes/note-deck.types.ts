import type { SharedValue } from 'react-native-reanimated';

export type NoteDeckItem = {
  id: string;
  title?: string;
  content: string;
  notebookName?: string;
  createdAt: Date | string;
};

export type NoteDeckProps = {
  notes: NoteDeckItem[];
};

export type DeckLayout = {
  cardWidth: number;
  cardGap: number;
  snapDistance: number;
  sidePeek: number;
  screenWidth: number;
};

export type VisibleDeckNote = {
  note: NoteDeckItem;
  index: number;
};

export type NoteDeckMotionValues = {
  scrollX: SharedValue<number>;
  panStartX: SharedValue<number>;
  maxScrollX: SharedValue<number>;
  snapDistanceShared: SharedValue<number>;
  maxIndexShared: SharedValue<number>;
  windowCenterIndexShared: SharedValue<number>;
};
