import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { Pressable, StyleSheet } from 'react-native';

import {
  SIDE_CARD_OPACITY,
  SIDE_CARD_ROTATION_DEG,
  SIDE_CARD_SCALE,
} from '@/components/notes/deck/note-deck.constants';
import { Note } from '@/components/notes/note';
import type { NoteDeckItem } from '@/types/notes/note-deck.types';

type NoteDeckCardProps = {
  cardGap: number;
  cardWidth: number;
  index: number;
  isLast: boolean;
  note: NoteDeckItem;
  onPress?: (note: NoteDeckItem) => void;
  scrollX: SharedValue<number>;
  snapDistance: number;
};

export function NoteDeckCard({
  cardGap,
  cardWidth,
  index,
  isLast,
  note,
  onPress,
  scrollX,
  snapDistance,
}: NoteDeckCardProps) {
  const cardStyle = useAnimatedStyle(() => {
    const distanceFromCenter = Math.abs(scrollX.value / snapDistance - index);
    const scale = interpolate(
      distanceFromCenter,
      [0, 1],
      [1, SIDE_CARD_SCALE],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      distanceFromCenter,
      [0, 1],
      [1, SIDE_CARD_OPACITY],
      Extrapolation.CLAMP,
    );
    const rotate = interpolate(
      scrollX.value / snapDistance - index,
      [-1, 0, 1],
      [SIDE_CARD_ROTATION_DEG, 0, -SIDE_CARD_ROTATION_DEG],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      zIndex: distanceFromCenter < 0.5 ? 2 : 1,
      transform: [{ perspective: 900 }, { rotate: `${rotate}deg` }, { scale }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.cardSlot,
        { width: cardWidth },
        !isLast && { marginRight: cardGap },
        cardStyle,
      ]}
    >
      <Pressable onPress={() => onPress?.(note)}>
        <Note
          content={note.content}
          textColor={note.textColor}
          notebookName={note.notebookName}
          createdAt={note.createdAt}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardSlot: {
    flexGrow: 0,
  },
});
