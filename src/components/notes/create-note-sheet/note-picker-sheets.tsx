import {
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { type RefObject, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ColorSwatchRow, type ColorSwatchOption } from '@/components/color-swatch-row';
import { ChevronRightIcon, NotebookSelectIcon } from '@/components/icons';
import type { PickerMode } from '@/components/notes/create-note-sheet/constants';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Theme } from '@/hooks/use-theme';

type NotePickerSheetsProps = {
  pickerSheetRef: RefObject<BottomSheetModal | null>;
  visiblePicker: PickerMode;
  bottomInset: number;
  notebookName: string;
  noteColorOptions: ColorSwatchOption[];
  selectedColorIndex: number;
  theme: Theme;
  sheetBackgroundStyle: object[];
  handleIndicatorStyle: object[];
  renderBackdrop: (props: BottomSheetBackdropProps) => ReactNode;
  onPickerDismiss: () => void;
  onColorSelect: (index: number) => void;
};

function BorderedRowCard({
  backgroundColor,
  borderColor,
  children,
}: {
  backgroundColor: string;
  borderColor: string;
  children: ReactNode;
}) {
  return <View style={[styles.borderedRow, { backgroundColor, borderColor }]}>{children}</View>;
}

export function NotePickerSheets({
  pickerSheetRef,
  visiblePicker,
  bottomInset,
  notebookName,
  noteColorOptions,
  selectedColorIndex,
  theme,
  sheetBackgroundStyle,
  handleIndicatorStyle,
  renderBackdrop,
  onPickerDismiss,
  onColorSelect,
}: NotePickerSheetsProps) {
  return (
    <BottomSheetModal
      ref={pickerSheetRef}
      enableDynamicSizing
      stackBehavior="push"
      bottomInset={bottomInset}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={handleIndicatorStyle}
      backgroundStyle={sheetBackgroundStyle}
      onDismiss={onPickerDismiss}
    >
      <BottomSheetView style={styles.pickerSheetContent}>
        {visiblePicker === 'color' ? (
          <>
            <ThemedText style={styles.pickerSheetTitle}>Color</ThemedText>
            <ColorSwatchRow
              colorOptions={noteColorOptions}
              selectedColorIndex={selectedColorIndex}
              onColorSelect={onColorSelect}
            />
          </>
        ) : null}

        {visiblePicker === 'notebook' ? (
          <>
            <ThemedText style={styles.pickerSheetTitle}>Notebook</ThemedText>
            <BorderedRowCard backgroundColor={theme.background} borderColor={theme.navBarBorder}>
              <View style={styles.notebookRowInner}>
                <View style={[styles.rowIcon, { backgroundColor: theme.notebookIconBackground }]}>
                  <NotebookSelectIcon color={theme.navActive} size={22} />
                </View>
                <View style={styles.notebookTextBlock}>
                  <ThemedText themeColor="textSecondary" style={styles.rowLabel}>
                    Notebook
                  </ThemedText>
                  <ThemedText style={styles.rowValue}>{notebookName}</ThemedText>
                </View>
                <ChevronRightIcon color={theme.textSecondary} size={20} />
              </View>
            </BorderedRowCard>
          </>
        ) : null}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  borderedRow: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
    overflow: 'hidden',
  },
  notebookRowInner: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notebookTextBlock: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  rowValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  pickerSheetContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  pickerSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: Spacing.three,
  },
});
