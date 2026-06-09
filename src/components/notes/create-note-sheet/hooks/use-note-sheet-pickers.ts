import { useCallback, useState, type RefObject } from 'react';
import { Keyboard, InteractionManager } from 'react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

import type { PickerMode } from '@/components/notes/create-note-sheet/constants';

export function useNoteSheetPickers(pickerSheetRef: RefObject<BottomSheetModal | null>) {
  const [activePicker, setActivePicker] = useState<PickerMode | null>(null);
  const [lastPickerMode, setLastPickerMode] = useState<PickerMode>('color');

  const visiblePicker = activePicker ?? lastPickerMode;

  const presentPicker = useCallback(
    (mode: PickerMode) => {
      Keyboard.dismiss();
      setLastPickerMode(mode);
      setActivePicker(mode);

      InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          pickerSheetRef.current?.present();
        });
      });
    },
    [pickerSheetRef],
  );

  const openColorPicker = useCallback(() => {
    presentPicker('color');
  }, [presentPicker]);

  const openNotebookPicker = useCallback(() => {
    presentPicker('notebook');
  }, [presentPicker]);

  const handlePickerDismiss = useCallback(() => {
    setActivePicker(null);
  }, []);

  const clearPickers = useCallback(() => {
    setActivePicker(null);
    pickerSheetRef.current?.dismiss();
  }, [pickerSheetRef]);

  return {
    visiblePicker,
    openColorPicker,
    openNotebookPicker,
    handlePickerDismiss,
    clearPickers,
  };
}
