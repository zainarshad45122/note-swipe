import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CreateNoteIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import {
  BOTTOM_SHEET_BACKDROP_OPACITY,
  createBottomSheetBackgroundStyle,
} from '@/utils/bottom-sheet/bottom-sheet-style';
import { useTheme } from '@/hooks/use-theme';

export type CreateNotebookSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

type CreateNotebookSheetProps = {
  onCreateNotebook: (title: string) => void | Promise<void>;
};

export const CreateNotebookSheet = forwardRef<CreateNotebookSheetHandle, CreateNotebookSheetProps>(
  function CreateNotebookSheet({ onCreateNotebook }, ref) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const modalRef = useRef<BottomSheetModal>(null);
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sheetBackgroundStyle = useMemo(() => createBottomSheetBackgroundStyle(theme), [theme]);

    const resetForm = useCallback(() => {
      setTitle('');
      setIsSubmitting(false);
    }, []);

    const handlePresent = useCallback(() => {
      modalRef.current?.present();
    }, []);

    const handleDismiss = useCallback(() => {
      resetForm();
      modalRef.current?.dismiss();
    }, [resetForm]);

    useImperativeHandle(
      ref,
      () => ({
        present: handlePresent,
        dismiss: handleDismiss,
      }),
      [handleDismiss, handlePresent],
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

    const handleCreate = useCallback(async () => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle || isSubmitting) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onCreateNotebook(trimmedTitle);
        handleDismiss();
      } finally {
        setIsSubmitting(false);
      }
    }, [handleDismiss, isSubmitting, onCreateNotebook, title]);

    const canCreate = title.trim().length > 0 && !isSubmitting;

    return (
      <BottomSheetModal
        ref={modalRef}
        enableDynamicSizing
        bottomInset={0}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: theme.textSecondary }]}
        backgroundStyle={sheetBackgroundStyle}
        onDismiss={resetForm}
      >
        <BottomSheetView
          style={[styles.content, { paddingBottom: Math.max(insets.bottom, Spacing.four) }]}
        >
          <ThemedText style={styles.sheetTitle}>New Notebook</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.sheetSubtitle}>
            Give your notebook a name
          </ThemedText>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Notebook title"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: theme.background,
                borderColor: theme.navBarBorder,
              },
            ]}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCreate}
            maxLength={80}
          />

          <Pressable
            style={[
              styles.createButton,
              { backgroundColor: theme.accent },
              !canCreate && styles.createButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={!canCreate}
          >
            <CreateNoteIcon color={theme.fabForeground} size={20} />
            <ThemedText style={[styles.createButtonText, { color: theme.fabForeground }]}>
              Create Notebook
            </ThemedText>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  handleIndicator: {
    width: 44,
    height: 4,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: Spacing.one,
  },
  sheetSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.three,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: Spacing.three,
  },
  createButton: {
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  createButtonDisabled: {
    opacity: 0.45,
  },
  createButtonText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },
});
