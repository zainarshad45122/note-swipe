import { BottomSheetModal, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon, SparklesIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';

const NOTE_CHARACTER_LIMIT = 2000;

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

export const CreateNoteSheet = forwardRef<CreateNoteSheetHandle, CreateNoteSheetProps>(
  function CreateNoteSheet({ notebookName = 'Personal' }, ref) {
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();
    const modalRef = useRef<BottomSheetModal>(null);
    const richTextRef = useRef<any>(null);
    const [htmlContent, setHtmlContent] = useState('');

    const plainText = useMemo(() => stripHtmlToText(htmlContent), [htmlContent]);
    const characterCount = plainText.length;
    const snapPoints = useMemo(() => ['90%'], []);
    const toolbarBackgroundColor = isDark ? '#1B1C20' : '#F3F4F6';
    const toolbarTextColor = isDark ? '#F8FAFC' : '#111827';

    const handlePresent = useCallback(() => {
      modalRef.current?.present();
    }, []);

    const handleDismiss = useCallback(() => {
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

    return (
      <BottomSheetModal
        ref={modalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        handleIndicatorStyle={[styles.handleIndicator, { backgroundColor: theme.textSecondary }]}
        backgroundStyle={[styles.sheetBackground, { backgroundColor: theme.background }]}
      >
        <BottomSheetView style={styles.container}>
          <BottomSheetScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + Spacing.four },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Pressable
                style={[styles.roundButton, { borderColor: theme.navBarBorder }]}
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
              <Pressable style={[styles.roundButton, { borderColor: theme.navBarBorder }]}>
                <SparklesIcon color={theme.navActive} size={16} />
              </Pressable>
            </View>

            <ThemedView type="background" borderType="navBarBorder" style={styles.editorCard}>
              <RichEditor
                ref={richTextRef}
                initialContentHTML=""
                placeholder="Start writing..."
                style={styles.editor}
                editorStyle={{
                  backgroundColor: theme.background,
                  color: theme.text,
                  placeholderColor: theme.textSecondary,
                  contentCSSText:
                    'font-size:18px; line-height:28px; font-family: -apple-system, system-ui, sans-serif; padding: 0;',
                }}
                onChange={setHtmlContent}
              />
              <View style={styles.editorFooter}>
                <ThemedText themeColor="textSecondary" type="small">
                  {characterCount} / {NOTE_CHARACTER_LIMIT}
                </ThemedText>
              </View>
              <RichToolbar
                editor={richTextRef}
                style={[
                  styles.toolbar,
                  { borderTopColor: theme.navBarBorder, backgroundColor: toolbarBackgroundColor },
                ]}
                selectedIconTint={theme.navActive}
                iconTint={toolbarTextColor}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                ]}
                iconMap={{
                  [actions.setBold]: () => (
                    <View style={styles.toolbarIconWrap}>
                      <ThemedText style={[styles.toolbarText, { color: toolbarTextColor }]}>
                        B
                      </ThemedText>
                    </View>
                  ),
                  [actions.setItalic]: () => (
                    <View style={styles.toolbarIconWrap}>
                      <ThemedText style={[styles.toolbarText, { color: toolbarTextColor }]}>
                        I
                      </ThemedText>
                    </View>
                  ),
                  [actions.insertBulletsList]: () => (
                    <View style={styles.toolbarIconWrap}>
                      <ThemedText style={[styles.toolbarText, { color: toolbarTextColor }]}>
                        •
                      </ThemedText>
                    </View>
                  ),
                  [actions.insertOrderedList]: () => (
                    <View style={styles.toolbarIconWrap}>
                      <ThemedText style={[styles.toolbarText, { color: toolbarTextColor }]}>
                        1.
                      </ThemedText>
                    </View>
                  ),
                }}
              />
            </ThemedView>

            <Pressable
              style={[styles.notebookRow, { borderColor: theme.navBarBorder }]}
              onPress={() => {
                // Notebook selection is intentionally static for now.
              }}
            >
              <View style={[styles.notebookIcon, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText themeColor="navActive" style={styles.notebookIconText}>
                  N
                </ThemedText>
              </View>
              <View style={styles.notebookTextBlock}>
                <ThemedText themeColor="textSecondary" style={styles.rowLabel}>
                  Notebook
                </ThemedText>
                <ThemedText style={styles.rowValue}>{notebookName}</ThemedText>
              </View>
              <ThemedText themeColor="textSecondary" style={styles.chevron}>
                &gt;
              </ThemedText>
            </Pressable>

            <ThemedView type="background" borderType="navBarBorder" style={styles.colorRow}>
              <ThemedText style={styles.rowValue}>Color</ThemedText>
              <View style={styles.swatchRow}>
                <View style={[styles.swatch, styles.swatchBlue]} />
                <View style={[styles.swatch, styles.swatchPink]} />
                <View style={[styles.swatch, styles.swatchOrange]} />
                <View style={[styles.swatch, styles.swatchYellow]} />
                <View style={[styles.swatch, styles.swatchGreen]} />
                <View style={[styles.swatch, styles.swatchSky]} />
                <View style={[styles.swatch, styles.swatchPurple]} />
              </View>
            </ThemedView>

            <Pressable style={styles.createButton}>
              <LinearGradient
                colors={[theme.fabGradientStart, theme.fabGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.createButtonGradient}
              >
                <ThemedText style={styles.createButtonText}>Create Note</ThemedText>
              </LinearGradient>
            </Pressable>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  handleIndicator: {
    width: 44,
  },
  sheetBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
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
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  editorCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 340,
  },
  editor: {
    minHeight: 250,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  editorFooter: {
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  toolbar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
    paddingHorizontal: Spacing.one,
  },
  toolbarIconWrap: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
  },
  notebookRow: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  notebookIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notebookIconText: {
    fontWeight: '700',
  },
  notebookTextBlock: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  rowValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 22,
    lineHeight: 22,
  },
  colorRow: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  swatchBlue: { backgroundColor: '#A9A5FF' },
  swatchPink: { backgroundColor: '#FFD0DF' },
  swatchOrange: { backgroundColor: '#FFDAB5' },
  swatchYellow: { backgroundColor: '#FFF2B5' },
  swatchGreen: { backgroundColor: '#CCF1CF' },
  swatchSky: { backgroundColor: '#CCE8FF' },
  swatchPurple: { backgroundColor: '#E1D4FF' },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: Spacing.one,
  },
  createButtonGradient: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
});
