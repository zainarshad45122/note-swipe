import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { CloseIcon, ColorPaletteIcon, NotebookSelectIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Theme } from '@/hooks/use-theme';

type CreateNoteSheetHeaderProps = {
  isEditMode: boolean;
  notebookName: string;
  theme: Theme;
  onClose: () => void;
  onOpenNotebookPicker: () => void;
  onOpenColorPicker: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export function CreateNoteSheetHeader({
  isEditMode,
  notebookName,
  theme,
  onClose,
  onOpenNotebookPicker,
  onOpenColorPicker,
  onLayout,
}: CreateNoteSheetHeaderProps) {
  return (
    <View style={styles.header} onLayout={onLayout}>
      <Pressable
        style={[
          styles.roundButton,
          {
            backgroundColor: theme.roundButtonBackground,
            borderColor: theme.navBarBorder,
          },
        ]}
        onPress={onClose}
      >
        <CloseIcon color={theme.text} size={16} />
      </Pressable>

      <View style={styles.headerTitleBlock}>
        <ThemedText style={styles.headerTitle}>{isEditMode ? 'Edit Note' : 'New Note'}</ThemedText>
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
          onPress={onOpenNotebookPicker}
          accessibilityLabel="Choose notebook"
          hitSlop={8}
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
          onPress={onOpenColorPicker}
          accessibilityLabel="Choose note color"
          hitSlop={8}
        >
          <ColorPaletteIcon color={theme.colorIconForeground} size={18} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
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
});
