import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { CreateNoteIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useEffectiveBottomInset } from '@/hooks/use-effective-bottom-inset';
import { useTheme } from '@/hooks/use-theme';

export type CreateNotebookSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

type CreateNotebookSheetProps = {
  onCreateNotebook: (title: string) => void;
};

export const CreateNotebookSheet = forwardRef<CreateNotebookSheetHandle, CreateNotebookSheetProps>(
  function CreateNotebookSheet({ onCreateNotebook }, ref) {
    const theme = useTheme();
    const bottomInset = useEffectiveBottomInset();
    const modalRef = useRef<BottomSheetModal>(null);
    const [title, setTitle] = useState('');

    const sheetBackgroundStyle = useMemo(
      () => [styles.sheetBackground, { backgroundColor: theme.background }],
      [theme.background],
    );

    const resetForm = useCallback(() => {
      setTitle('');
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
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.25} />
      ),
      [],
    );

    const handleCreate = useCallback(() => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        return;
      }

      onCreateNotebook(trimmedTitle);
      handleDismiss();
    }, [handleDismiss, onCreateNotebook, title]);

    const canCreate = title.trim().length > 0;

    return (
      <BottomSheetModal
        ref={modalRef}
        enableDynamicSizing
        bottomInset={bottomInset}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: theme.textSecondary }]}
        backgroundStyle={sheetBackgroundStyle}
        onDismiss={resetForm}
      >
        <BottomSheetView
          style={[styles.content, { paddingBottom: Math.max(bottomInset, Spacing.four) }]}
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
  sheetBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
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
