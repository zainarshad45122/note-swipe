declare module 'react-native-pell-rich-editor' {
  import type { ComponentType, RefObject } from 'react';
  import type { StyleProp, ViewStyle } from 'react-native';

  export const actions: Record<string, string>;

  export type RichEditorProps = {
    ref?: RefObject<unknown>;
    initialContentHTML?: string;
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
    editorStyle?: Record<string, unknown>;
    onChange?: (value: string) => void;
  };

  export const RichEditor: ComponentType<RichEditorProps>;

  export type RichToolbarProps = {
    editor: RefObject<unknown>;
    style?: StyleProp<ViewStyle>;
    selectedIconTint?: string;
    iconTint?: string;
    actions?: string[];
    iconMap?: Record<string, () => JSX.Element>;
  };

  export const RichToolbar: ComponentType<RichToolbarProps>;
}
