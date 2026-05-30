import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {
  forwardRef,
  useCallback,
  useEffect,
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
import { RichEditor, actions, type RichEditorHandle } from 'react-native-pell-rich-editor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ColorSwatchRow, type ColorSwatchOption } from '@/components/color-swatch-row';
import {
  ChevronRightIcon,
  CloseIcon,
  ColorPaletteIcon,
  CreateNoteIcon,
  NotebookSelectIcon,
} from '@/components/icons';
import { CreateNoteEditorToolbar } from '@/components/notes/create-note-editor-toolbar';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffectiveBottomInset } from '@/hooks/use-effective-bottom-inset';
import { useTheme } from '@/hooks/use-theme';

const NOTE_CHARACTER_LIMIT = 2000;

const NOTE_ACCENT_COLORS = [
  '#6366F1',
  '#DB2777',
  '#EA580C',
  '#CA8A04',
  '#16A34A',
  '#2563EB',
  '#9333EA',
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
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const bottomInset = useEffectiveBottomInset();
    const { height: windowHeight } = useWindowDimensions();
    const modalRef = useRef<BottomSheetModal>(null);
    const colorPickerRef = useRef<BottomSheetModal>(null);
    const notebookPickerRef = useRef<BottomSheetModal>(null);
    const richTextRef = useRef<RichEditorHandle | null>(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [bottomChromeHeight, setBottomChromeHeight] = useState(0);

    const noteColorOptions = useMemo<ColorSwatchOption[]>(
      () => [
        { key: 'default', color: theme.text, isDefault: true },
        ...NOTE_ACCENT_COLORS.map((color, index) => ({
          key: `accent-${index}`,
          color,
          isDefault: false,
        })),
      ],
      [theme.text],
    );

    const selectedNoteColor = noteColorOptions[selectedColorIndex]?.color ?? theme.text;

    const applyNoteTextColor = useCallback((color: string) => {
      const editor = richTextRef.current;

      if (!editor) {
        return;
      }

      editor.setContentStyle({ color });
      editor.showAndroidKeyboard();
      editor.sendAction(actions.foreColor, 'result', color);
    }, []);

    useEffect(() => {
      setSelectedColorIndex(0);
    }, [colorScheme]);

    useEffect(() => {
      if (!isEditorReady) {
        return;
      }

      applyNoteTextColor(selectedNoteColor);
    }, [applyNoteTextColor, isEditorReady, selectedNoteColor]);

    const handleColorSelect = useCallback((index: number) => {
      setSelectedColorIndex(index);
    }, []);

    const plainText = useMemo(() => stripHtmlToText(htmlContent), [htmlContent]);
    const characterCount = plainText.length;

    const sheetContentHeight = windowHeight - insets.top - bottomInset;

    const editorHeight = useMemo(() => {
      if (headerHeight === 0 || bottomChromeHeight === 0) {
        return 0;
      }

      return Math.max(120, sheetContentHeight - headerHeight - bottomChromeHeight);
    }, [bottomChromeHeight, headerHeight, sheetContentHeight]);

    const snapPoints = useMemo(() => [sheetContentHeight], [sheetContentHeight]);

    const sheetBackgroundStyle = useMemo(
      () => [styles.sheetBackground, { backgroundColor: theme.background }],
      [theme.background],
    );

    const handlePresent = useCallback(() => {
      modalRef.current?.present();
    }, []);

    const handleDismiss = useCallback(() => {
      setIsEditorReady(false);
      colorPickerRef.current?.dismiss();
      notebookPickerRef.current?.dismiss();
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

    const handleHeaderLayout = useCallback((event: LayoutChangeEvent) => {
      setHeaderHeight(event.nativeEvent.layout.height);
    }, []);

    const handleBottomChromeLayout = useCallback((event: LayoutChangeEvent) => {
      setBottomChromeHeight(event.nativeEvent.layout.height);
    }, []);

    const openColorPicker = useCallback(() => {
      colorPickerRef.current?.present();
    }, []);

    const openNotebookPicker = useCallback(() => {
      notebookPickerRef.current?.present();
    }, []);

    return (
      <>
        <BottomSheetModal
          ref={modalRef}
          index={0}
          snapPoints={snapPoints}
          topInset={insets.top}
          bottomInset={bottomInset}
          enableDynamicSizing={false}
          enablePanDownToClose
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: theme.textSecondary }]}
          backgroundStyle={sheetBackgroundStyle}
        >
          <BottomSheetView style={[styles.container, { height: sheetContentHeight }]}>
            <View style={styles.header} onLayout={handleHeaderLayout}>
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
                <ThemedText themeColor="textSecondary" style={styles.headerNotebookName}>
                  {notebookName}
                </ThemedText>
              </View>

              <View style={styles.headerActions}>
                <Pressable
                  style={[
                    styles.roundButton,
                    {
                      backgroundColor: theme.roundButtonBackground,
                      borderColor: theme.navBarBorder,
                    },
                  ]}
                  onPress={openNotebookPicker}
                  accessibilityLabel="Choose notebook"
                >
                  <NotebookSelectIcon color={theme.navActive} size={18} />
                </Pressable>
                <Pressable
                  style={[
                    styles.roundButton,
                    {
                      backgroundColor: theme.roundButtonBackground,
                      borderColor: theme.navBarBorder,
                    },
                  ]}
                  onPress={openColorPicker}
                  accessibilityLabel="Choose note color"
                >
                  <ColorPaletteIcon color={theme.colorIconForeground} size={18} />
                </Pressable>
              </View>
            </View>

            <View style={[styles.editorBody, editorHeight > 0 && { height: editorHeight }]}>
              <RichEditor
                ref={richTextRef}
                initialContentHTML=""
                placeholder="Start writing..."
                style={[styles.editor, editorHeight > 0 && { height: editorHeight }]}
                editorInitializedCallback={() => setIsEditorReady(true)}
                editorStyle={{
                  backgroundColor: theme.background,
                  color: selectedNoteColor,
                  placeholderColor: theme.textSecondary,
                  contentCSSText:
                    'font-size:16px; line-height:24px; font-family: -apple-system, system-ui, sans-serif; padding: 0;',
                }}
                onChange={setHtmlContent}
              />
            </View>

            <View style={styles.bottomChrome} onLayout={handleBottomChromeLayout}>
              <View style={styles.editorChrome}>
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

              <View style={styles.footer}>
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
            </View>
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={colorPickerRef}
          enableDynamicSizing
          stackBehavior="push"
          bottomInset={bottomInset}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: theme.textSecondary }]}
          backgroundStyle={sheetBackgroundStyle}
        >
          <BottomSheetView
            style={[
              styles.pickerSheetContent,
              { paddingBottom: Math.max(bottomInset, Spacing.four) },
            ]}
          >
            <ThemedText style={styles.pickerSheetTitle}>Color</ThemedText>
            <ColorSwatchRow
              colorOptions={noteColorOptions}
              selectedColorIndex={selectedColorIndex}
              onColorSelect={handleColorSelect}
            />
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={notebookPickerRef}
          enableDynamicSizing
          stackBehavior="push"
          bottomInset={bottomInset}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: theme.textSecondary }]}
          backgroundStyle={sheetBackgroundStyle}
        >
          <BottomSheetView
            style={[
              styles.pickerSheetContent,
              { paddingBottom: Math.max(bottomInset, Spacing.four) },
            ]}
          >
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
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  header: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
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
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  headerNotebookName: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  editorBody: {
    flexShrink: 0,
  },
  editor: {
    width: '100%',
  },
  bottomChrome: {
    flexShrink: 0,
  },
  editorChrome: {
    flexShrink: 0,
  },
  editorFooter: {
    alignItems: 'flex-end',
    paddingTop: Spacing.one,
    paddingBottom: Spacing.one,
  },
  characterCount: {
    fontSize: 12,
    lineHeight: 16,
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
  footer: {
    flexShrink: 0,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
  },
  createButton: {
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginBottom: 16,
  },
  createButtonText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },
  pickerSheetContent: {
    paddingHorizontal: Spacing.three,
  },
  pickerSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: Spacing.three,
  },
});
