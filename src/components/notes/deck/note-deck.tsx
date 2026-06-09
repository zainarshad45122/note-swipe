import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { NoteDeckCard } from '@/components/notes/deck/note-deck-card';
import { NoteDeckControls } from '@/components/notes/deck/note-deck-controls';
import { getDeckLayout } from '@/components/notes/deck/note-deck.math';
import { useNoteDeckGesture } from '@/components/notes/deck/use-note-deck-gesture';
import { useNoteDeckWindow } from '@/components/notes/deck/use-note-deck-window';
import type { NoteDeckProps } from '@/types/notes/note-deck.types';

export function NoteDeck({ notes, onNotePress }: NoteDeckProps) {
  const { width: screenWidth } = useWindowDimensions();
  const layout = getDeckLayout(screenWidth);

  const window = useNoteDeckWindow({ notes, layout });

  const gesture = useNoteDeckGesture({
    layout,
    motion: window.motion,
    noteCount: notes.length,
    commitSettledIndex: window.commitSettledIndex,
    commitWindowCenterIndex: window.commitWindowCenterIndex,
  });

  return (
    <View style={styles.deck}>
      <GestureDetector gesture={gesture.panGesture}>
        <Animated.View style={[styles.viewport, { width: layout.screenWidth }]}>
          <Animated.View
            style={[styles.strip, { paddingLeft: window.virtualPaddingLeft }, gesture.stripStyle]}
          >
            {window.visibleNotes.map(({ note, index }) => (
              <NoteDeckCard
                key={note.id}
                cardGap={layout.cardGap}
                cardWidth={layout.cardWidth}
                index={index}
                isLast={index >= notes.length - 1}
                note={note}
                onPress={onNotePress}
                scrollX={window.motion.scrollX}
                snapDistance={layout.snapDistance}
              />
            ))}
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <NoteDeckControls
        atFirst={window.atFirst}
        atLast={window.atLast}
        currentIndex={window.currentWindowCenterIndex}
        noteCount={notes.length}
        onPrevious={() => gesture.goToPrevious(window.currentWindowCenterIndex)}
        onNext={() => gesture.goToNext(window.currentWindowCenterIndex)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  deck: {
    width: '100%',
  },
  viewport: {
    overflow: 'hidden',
    paddingBottom: 12,
    paddingTop: 8,
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
