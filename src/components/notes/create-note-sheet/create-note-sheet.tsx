import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';

import { CreateNoteEditorSection } from '@/components/notes/create-note-sheet/create-note-editor-section';
import { CreateNoteFooter } from '@/components/notes/create-note-sheet/create-note-footer';
import { CreateNoteSheetHeader } from '@/components/notes/create-note-sheet/create-note-sheet-header';
import { useCreateNoteSheetLayout } from '@/components/notes/create-note-sheet/hooks/use-create-note-sheet-layout';
import { useNoteColorOptions } from '@/components/notes/create-note-sheet/hooks/use-note-color-options';
import { useNoteFormDraft } from '@/components/notes/create-note-sheet/hooks/use-note-form-draft';
import { useNoteRichEditor } from '@/components/notes/create-note-sheet/hooks/use-note-rich-editor';
import { useNoteSheetController } from '@/components/notes/create-note-sheet/hooks/use-note-sheet-controller';
import { useNoteSheetPickers } from '@/components/notes/create-note-sheet/hooks/use-note-sheet-pickers';
import { useNoteSubmit } from '@/components/notes/create-note-sheet/hooks/use-note-submit';
import { NotePickerSheets } from '@/components/notes/create-note-sheet/note-picker-sheets';
import { Spacing } from '@/constants/theme';
import { BOTTOM_SHEET_BACKDROP_OPACITY } from '@/utils/bottom-sheet/bottom-sheet-style';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

type CreateNoteSheetProps = {
  notebookId?: string;
  notebookName?: string;
};

export type CreateNoteSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

export const CreateNoteSheet = forwardRef<CreateNoteSheetHandle, CreateNoteSheetProps>(
  function CreateNoteSheet({ notebookId, notebookName = 'Personal' }, ref) {
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const pickerSheetRef = useRef<BottomSheetModal>(null);
    const dismissRef = useRef<() => void>(() => undefined);

    const noteColorOptions = useNoteColorOptions(theme.text);

    const {
      draft,
      characterCount,
      plainText,
      setHtmlContent,
      setSelectedColorIndex,
      resetDraft,
      loadDraftFromNote,
    } = useNoteFormDraft({
      defaultNotebookId: notebookId,
      defaultNotebookName: notebookName,
      colorOptions: noteColorOptions,
    });

    const selectedNoteColor = noteColorOptions[draft.selectedColorIndex]?.color ?? theme.text;

    const {
      bottomInset,
      handleBottomChromeLayout,
      handleHeaderLayout,
      insets,
      sheetBackgroundStyle,
      sheetContentHeight,
      snapPoints,
    } = useCreateNoteSheetLayout(theme);

    const {
      visiblePicker,
      openColorPicker,
      openNotebookPicker,
      handlePickerDismiss,
      clearPickers,
    } = useNoteSheetPickers(pickerSheetRef);

    const {
      richTextRef,
      isEditorReady,
      editorKey,
      initialContentHTML,
      applyNoteTextColor,
      resetEditorContent,
      handleEditorInitialized,
      resetEditorReady,
    } = useNoteRichEditor({
      selectedNoteColor,
      themeText: theme.text,
    });

    const handleSubmitSuccess = useCallback(() => {
      resetDraft();
      resetEditorContent();
      dismissRef.current();
    }, [resetDraft, resetEditorContent]);

    const { isSaving, submitError, clearSubmitError, handleSubmit } = useNoteSubmit({
      draft,
      plainText,
      selectedNoteColor,
      onSuccess: handleSubmitSuccess,
    });

    const { modalRef, isEditMode, handleDismiss, requestOpenCreate } = useNoteSheetController({
      colorOptions: noteColorOptions,
      loadDraftFromNote,
      resetDraft,
      resetEditorContent,
      resetEditorReady,
      clearPickers,
      clearSubmitError,
      onDismissComplete: () => undefined,
    });

    dismissRef.current = handleDismiss;

    useEffect(() => {
      setSelectedColorIndex(0);
    }, [colorScheme, setSelectedColorIndex]);

    const handleColorSelect = useCallback(
      (index: number) => {
        setSelectedColorIndex(index);
        const nextColor = noteColorOptions[index]?.color;
        if (nextColor && isEditorReady) {
          applyNoteTextColor(nextColor);
        }
      },
      [applyNoteTextColor, isEditorReady, noteColorOptions, setSelectedColorIndex],
    );

    useImperativeHandle(
      ref,
      () => ({
        present: () => requestOpenCreate(),
        dismiss: handleDismiss,
      }),
      [handleDismiss, requestOpenCreate],
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={BOTTOM_SHEET_BACKDROP_OPACITY}
        />
      ),
      [],
    );

    const handleIndicatorStyle = [styles.handleIndicator, { backgroundColor: theme.textSecondary }];

    return (
      <BottomSheetModal
        ref={modalRef}
        index={0}
        snapPoints={snapPoints}
        topInset={insets.top}
        bottomInset={0}
        enableDynamicSizing={false}
        enablePanDownToClose
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={handleIndicatorStyle}
        backgroundStyle={sheetBackgroundStyle}
      >
        <BottomSheetView style={[styles.container, { height: sheetContentHeight }]}>
          <CreateNoteSheetHeader
            isEditMode={isEditMode}
            notebookName={draft.notebookName}
            theme={theme}
            onClose={handleDismiss}
            onOpenNotebookPicker={openNotebookPicker}
            onOpenColorPicker={openColorPicker}
            onLayout={handleHeaderLayout}
          />

          <CreateNoteEditorSection
            editorRef={richTextRef}
            editorKey={editorKey}
            initialContentHTML={initialContentHTML}
            selectedNoteColor={selectedNoteColor}
            theme={theme}
            onChange={setHtmlContent}
            onEditorInitialized={handleEditorInitialized}
          />

          <CreateNoteFooter
            bottomInset={bottomInset}
            characterCount={characterCount}
            editorRef={richTextRef}
            editorReady={isEditorReady}
            isEditMode={isEditMode}
            isSaving={isSaving}
            submitError={submitError}
            theme={theme}
            onLayout={handleBottomChromeLayout}
            onSubmit={handleSubmit}
          />
        </BottomSheetView>

        <NotePickerSheets
          pickerSheetRef={pickerSheetRef}
          visiblePicker={visiblePicker}
          bottomInset={bottomInset}
          notebookName={draft.notebookName}
          noteColorOptions={noteColorOptions}
          selectedColorIndex={draft.selectedColorIndex}
          theme={theme}
          sheetBackgroundStyle={sheetBackgroundStyle}
          handleIndicatorStyle={handleIndicatorStyle}
          renderBackdrop={renderBackdrop}
          onPickerDismiss={handlePickerDismiss}
          onColorSelect={handleColorSelect}
        />
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  handleIndicator: {
    width: 44,
    height: 4,
  },
});
