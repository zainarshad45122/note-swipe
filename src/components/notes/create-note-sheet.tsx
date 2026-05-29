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
  type ReactNode,
} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { RichEditor } from 'react-native-pell-rich-editor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ChevronRightIcon,
  CloseIcon,
  ColorPaletteIcon,
  CreateNoteIcon,
  NotebookSelectIcon,
  SparklesIcon,
} from '@/components/icons';
import { CreateNoteEditorToolbar } from '@/components/notes/create-note-editor-toolbar';
import { ThemedText } from '@/components/themed-text';
import { EditorCardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const NOTE_CHARACTER_LIMIT = 2000;

const NOTE_COLORS = [
  '#A9A5FF',
  '#FFD0DF',
  '#FFDAB5',
  '#FFF2B5',
  '#CCF1CF',
  '#CCE8FF',
  '#E1D4FF',
] as const;

type CreateNoteSheetProps = {
  notebookName?: string;
};

export type CreateNoteSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

function stripHtmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function EditorCard({
  backgroundColor,
  children,
}: {
  backgroundColor: string;
  children: ReactNode;
}) {
  return (
    <View style={[styles.editorCardWrap, EditorCardShadow]}>
      <View style={[styles.editorCard, { backgroundColor }]}>{children}</View>
    </View>
  );
}

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

export const CreateNoteSheet = forwardRef<CreateNoteSheetHandle, CreateNoteSheetProps>(
  function CreateNoteSheet({ notebookName = 'Personal' }, ref) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { height: windowHeight } = useWindowDimensions();
    const modalRef = useRef<BottomSheetModal>(null);
    const richTextRef = useRef<{
      sendAction: (type: string, action: string, data?: unknown, options?: unknown) => void;
      showAndroidKeyboard: () => void;
      registerToolbar: (
        listener: (items: Array<string | { type: string; value?: unknown }>) => void,
      ) => void;
    } | null>(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [isEditorReady, setIsEditorReady] = useState(false);

    const plainText = useMemo(() => stripHtmlToText(htmlContent), [htmlContent]);
    const characterCount = plainText.length;

    const snapPoints = useMemo(() => [windowHeight - insets.top], [windowHeight, insets.top]);

    const sheetBackgroundStyle = useMemo(
      () => [styles.sheetBackground, { backgroundColor: theme.background }],
      [theme.background],
    );

    const handlePresent = useCallback(() => {
      modalRef.current?.present();
    }, []);

    const handleDismiss = useCallback(() => {
      setIsEditorReady(false);
      modalRef.current?.dismiss();
    }, []);

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

    return (
      <BottomSheetModal
        ref={modalRef}
        index={0}
        snapPoints={snapPoints}
        topInset={insets.top}
        enableDynamicSizing={false}
        enablePanDownToClose
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: theme.textSecondary }]}
        backgroundStyle={sheetBackgroundStyle}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.body}>
            <View style={styles.header}>
              <Pressable
                style={[
                  styles.roundButton,
                  {
                    backgroundColor: theme.roundButtonBackground,
                    borderColor: theme.navBarBorder,
                  },
                ]}
                onPress={handleDismiss}
              >
                <CloseIcon color={theme.text} size={16} />
              </Pressable>
              <View style={styles.headerTitleBlock}>
                <ThemedText style={styles.headerTitle}>New Note</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.headerSubtitle}>
                  Capture your thoughts
                </ThemedText>
              </View>
              <Pressable
                style={[
                  styles.roundButton,
                  {
                    backgroundColor: theme.roundButtonBackground,
                    borderColor: theme.navBarBorder,
                  },
                ]}
              >
                <SparklesIcon color={theme.navActive} size={18} />
              </Pressable>
            </View>

            <View style={styles.editorSection}>
              <EditorCard backgroundColor={theme.background}>
                <View style={styles.editorCardInner}>
                  <View style={styles.editorBody}>
                    <RichEditor
                      ref={richTextRef}
                      initialContentHTML=""
                      placeholder="Start writing..."
                      style={[styles.editor, { height: 420 }]}
                      editorInitializedCallback={() => setIsEditorReady(true)}
                      editorStyle={{
                        backgroundColor: theme.background,
                        color: theme.text,
                        placeholderColor: theme.textSecondary,
                        contentCSSText:
                          'font-size:16px; line-height:24px; font-family: -apple-system, system-ui, sans-serif; padding: 0;',
                      }}
                      onChange={setHtmlContent}
                    />
                  </View>
                  <View style={styles.editorFooter}>
                    <ThemedText themeColor="textSecondary" style={styles.characterCount}>
                      {characterCount} / {NOTE_CHARACTER_LIMIT}
                    </ThemedText>
                  </View>
                  <CreateNoteEditorToolbar
                    editorRef={richTextRef}
                    editorReady={isEditorReady}
                    theme={theme}
                    borderColor={theme.navBarBorder}
                    backgroundColor={theme.background}
                  />
                </View>
              </EditorCard>
            </View>

            <View style={styles.optionsSection}>
              <Pressable
                onPress={() => {
                  // Notebook selection is intentionally static for now.
                }}
              >
                <BorderedRowCard
                  backgroundColor={theme.background}
                  borderColor={theme.navBarBorder}
                >
                  <View style={styles.notebookRowInner}>
                    <View
                      style={[styles.rowIcon, { backgroundColor: theme.notebookIconBackground }]}
                    >
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
              </Pressable>

              <BorderedRowCard backgroundColor={theme.background} borderColor={theme.navBarBorder}>
                <View style={styles.colorHeader}>
                  <View style={[styles.rowIcon, { backgroundColor: theme.colorIconBackground }]}>
                    <ColorPaletteIcon color={theme.colorIconForeground} size={22} />
                  </View>
                  <ThemedText themeColor="textSecondary" style={styles.rowLabel}>
                    Color
                  </ThemedText>
                </View>
                <View style={styles.swatchRow}>
                  {NOTE_COLORS.map((color, index) => {
                    const isSelected = index === selectedColorIndex;

                    return (
                      <Pressable
                        key={color}
                        style={[styles.swatchWrap, isSelected && { borderColor: theme.navActive }]}
                        onPress={() => setSelectedColorIndex(index)}
                      >
                        <View style={[styles.swatch, { backgroundColor: color }]} />
                      </Pressable>
                    );
                  })}
                </View>
              </BorderedRowCard>
            </View>
          </View>

          <View style={[styles.footer]}>
            <Pressable
              style={[styles.createButton, { backgroundColor: theme.accent }]}
              onPress={() => {
                // Create flow is intentionally static for now.
              }}
            >
              <CreateNoteIcon color={theme.fabForeground} size={20} />
              <ThemedText style={[styles.createButtonText, { color: theme.fabForeground }]}>
                Create Note
              </ThemedText>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  body: {
    flex: 1,
    minHeight: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.one,
    paddingBottom: Spacing.three,
  },
  handleIndicator: {
    width: 44,
    height: 4,
  },
  sheetBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  roundButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBlock: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  editorSection: {
    flex: 1,
    minHeight: 350,
    marginBottom: Spacing.three,
  },
  editorCardWrap: {
    flex: 1,
    borderRadius: 18,
  },
  editorCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  editorCardInner: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'column',
  },
  editorBody: {
    flex: 1,
    minHeight: 120,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  editor: {
    width: '100%',
  },
  editorFooter: {
    flexShrink: 0,
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two,
  },
  characterCount: {
    fontSize: 12,
    lineHeight: 16,
  },
  optionsSection: {
    flexShrink: 0,
    gap: Spacing.three,
  },
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
  colorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: 14,
    paddingBottom: Spacing.two,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  swatchWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  footer: {
    flexShrink: 0,
  },
  createButton: {
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  createButtonText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    marginTop: 'auto',
  },
});
