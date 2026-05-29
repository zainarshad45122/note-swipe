import { useEffect, useState, type RefObject, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { actions, type RichEditorHandle } from 'react-native-pell-rich-editor';

import {
  EditorBulletListIcon,
  EditorNumberedListIcon,
} from '@/components/icons/create-note-toolbar-icons';
import { Spacing } from '@/constants/theme';
import type { Theme } from '@/hooks/use-theme';

type ToolbarSelection = string | { type: string; value?: unknown };

type CreateNoteEditorToolbarProps = {
  editorRef: RefObject<RichEditorHandle | null>;
  editorReady: boolean;
  theme: Theme;
  borderColor: string;
  backgroundColor: string;
};

const TOOLBAR_ITEMS: Array<{
  key: string;
  action: string;
  render: (color: string) => ReactNode;
}> = [
  {
    key: 'bold',
    action: actions.setBold,
    render: (color) => <Text style={[styles.formatLabel, styles.boldLabel, { color }]}>B</Text>,
  },
  {
    key: 'italic',
    action: actions.setItalic,
    render: (color) => (
      <Text style={[styles.formatLabel, styles.italicLabel, { color }]}>I</Text>
    ),
  },
  {
    key: 'bullet-list',
    action: actions.insertBulletsList,
    render: (color) => <EditorBulletListIcon color={color} size={22} />,
  },
  {
    key: 'numbered-list',
    action: actions.insertOrderedList,
    render: (color) => <EditorNumberedListIcon color={color} size={22} />,
  },
];

function normalizeSelectedActions(items: ToolbarSelection[]) {
  return items.map((item) => (typeof item === 'string' ? item : item.type));
}

function isActionSelected(action: string, selectedActions: string[]) {
  return selectedActions.includes(action);
}

export function CreateNoteEditorToolbar({
  editorRef,
  editorReady,
  theme,
  borderColor,
  backgroundColor,
}: CreateNoteEditorToolbarProps) {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  useEffect(() => {
    if (!editorReady) {
      return;
    }

    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    editor.registerToolbar((items) => {
      setSelectedActions(normalizeSelectedActions(items));
    });
  }, [editorReady, editorRef]);

  const runAction = (action: string) => {
    const editor = editorRef.current;

    if (!editor) {
      return;
    }

    editor.showAndroidKeyboard();
    editor.sendAction(action, 'result');
  };

  return (
    <View style={[styles.toolbar, { borderTopColor: borderColor, backgroundColor }]}>
      {TOOLBAR_ITEMS.map(({ key, render, action }) => {
        const selected = isActionSelected(action, selectedActions);
        const iconColor = selected ? theme.navActive : theme.editorToolbarText;

        return (
          <Pressable
            key={key}
            style={[
              styles.toolbarButton,
              selected && { backgroundColor: theme.notebookIconBackground },
            ]}
            onPress={() => runAction(action)}
            hitSlop={8}
          >
            {render(iconColor)}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexShrink: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  toolbarButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatLabel: {
    fontSize: 18,
    lineHeight: 22,
  },
  boldLabel: {
    fontWeight: '700',
  },
  italicLabel: {
    fontStyle: 'italic',
    fontWeight: '600',
  },
});
