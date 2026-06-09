import { type RefObject } from 'react';
import { StyleSheet, View } from 'react-native';
import { RichEditor, type RichEditorHandle } from 'react-native-pell-rich-editor';

import type { Theme } from '@/hooks/use-theme';

type CreateNoteEditorSectionProps = {
  editorRef: RefObject<RichEditorHandle | null>;
  editorKey: string;
  editorHeight: number;
  initialContentHTML: string;
  selectedNoteColor: string;
  theme: Theme;
  onChange: (html: string) => void;
  onEditorInitialized: () => void;
};

export function CreateNoteEditorSection({
  editorRef,
  editorKey,
  editorHeight,
  initialContentHTML,
  selectedNoteColor,
  theme,
  onChange,
  onEditorInitialized,
}: CreateNoteEditorSectionProps) {
  return (
    <View style={[styles.editorBody, editorHeight > 0 && { height: editorHeight }]}>
      <RichEditor
        key={editorKey}
        ref={editorRef}
        initialContentHTML={initialContentHTML}
        placeholder="Start writing..."
        style={[styles.editor, editorHeight > 0 && { height: editorHeight }]}
        editorInitializedCallback={onEditorInitialized}
        editorStyle={{
          backgroundColor: theme.background,
          color: selectedNoteColor,
          placeholderColor: theme.textSecondary,
          contentCSSText:
            'font-size:16px; line-height:24px; font-family: -apple-system, system-ui, sans-serif; padding: 0;',
        }}
        onChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  editorBody: {
    flexShrink: 0,
  },
  editor: {
    width: '100%',
  },
});
