import { useCallback, useMemo, useState } from 'react';
import { useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createBottomSheetBackgroundStyle } from '@/utils/bottom-sheet/bottom-sheet-style';
import type { Theme } from '@/hooks/use-theme';

export function useCreateNoteSheetLayout(theme: Theme) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [bottomChromeHeight, setBottomChromeHeight] = useState(0);

  const sheetContentHeight = windowHeight - insets.top;

  const editorHeight = useMemo(() => {
    if (headerHeight === 0 || bottomChromeHeight === 0) {
      return 0;
    }

    return Math.max(120, sheetContentHeight - headerHeight - bottomChromeHeight);
  }, [bottomChromeHeight, headerHeight, sheetContentHeight]);

  const snapPoints = useMemo(() => [sheetContentHeight], [sheetContentHeight]);

  const sheetBackgroundStyle = useMemo(() => createBottomSheetBackgroundStyle(theme), [theme]);

  const handleHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  const handleBottomChromeLayout = useCallback((event: LayoutChangeEvent) => {
    setBottomChromeHeight(event.nativeEvent.layout.height);
  }, []);

  return {
    bottomInset: insets.bottom,
    editorHeight,
    handleBottomChromeLayout,
    handleHeaderLayout,
    insets,
    sheetBackgroundStyle,
    sheetContentHeight,
    snapPoints,
  };
}
