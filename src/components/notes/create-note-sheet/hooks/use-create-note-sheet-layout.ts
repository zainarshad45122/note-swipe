import { useCallback, useMemo, useState } from 'react';
import { useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEffectiveBottomInset } from '@/hooks/use-effective-bottom-inset';

export function useCreateNoteSheetLayout(backgroundColor: string) {
  const insets = useSafeAreaInsets();
  const bottomInset = useEffectiveBottomInset();
  const { height: windowHeight } = useWindowDimensions();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [bottomChromeHeight, setBottomChromeHeight] = useState(0);

  const sheetContentHeight = windowHeight - insets.top - bottomInset;

  const editorHeight = useMemo(() => {
    if (headerHeight === 0 || bottomChromeHeight === 0) {
      return 0;
    }

    return Math.max(120, sheetContentHeight - headerHeight - bottomChromeHeight);
  }, [bottomChromeHeight, headerHeight, sheetContentHeight]);

  const snapPoints = useMemo(() => [sheetContentHeight], [sheetContentHeight]);

  const sheetBackgroundStyle = useMemo(
    () => [{ borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor }],
    [backgroundColor],
  );

  const handleHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    setHeaderHeight(event.nativeEvent.layout.height);
  }, []);

  const handleBottomChromeLayout = useCallback((event: LayoutChangeEvent) => {
    setBottomChromeHeight(event.nativeEvent.layout.height);
  }, []);

  return {
    bottomInset,
    editorHeight,
    handleBottomChromeLayout,
    handleHeaderLayout,
    insets,
    sheetBackgroundStyle,
    sheetContentHeight,
    snapPoints,
  };
}
