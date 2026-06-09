import { useCallback, useState, type RefObject } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { RichEditor } from 'react-native-pell-rich-editor';

import type { Theme } from '@/hooks/use-theme';

type CreateNoteEditorSectionProps = {
  editorRef: RefObject<RichEditor | null>;
  editorKey: string;
  initialContentHTML: string;
  selectedNoteColor: string;
  theme: Theme;
  onChange: (html: string) => void;
  onEditorInitialized: () => void;
};

export function CreateNoteEditorSection({
  editorRef,
  editorKey,
  initialContentHTML,
  selectedNoteColor,
  theme,
  onChange,
  onEditorInitialized,
}: CreateNoteEditorSectionProps) {
  const [editorHeight, setEditorHeight] = useState(0);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const nextHeight = Math.floor(event.nativeEvent.layout.height);
    if (nextHeight > 0) {
      setEditorHeight(nextHeight);
    }
  }, []);

  return (
    <View style={styles.editorBody} onLayout={handleLayout}>
      {editorHeight > 0 ? (
        <RichEditor
          key={editorKey}
          ref={editorRef}
          initialContentHTML={initialContentHTML}
          placeholder="Start writing..."
          useContainer={false}
          initialHeight={editorHeight}
          style={[styles.editor, { height: editorHeight }]}
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
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  editorBody: {
    flex: 1,
    minHeight: 120,
    overflow: 'hidden',
  },
  editor: {
    width: '100%',
  },
});
