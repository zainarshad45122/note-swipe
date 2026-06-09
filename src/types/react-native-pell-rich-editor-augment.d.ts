import 'react-native-pell-rich-editor';

declare module 'react-native-pell-rich-editor' {
  interface RichEditor {
    setContentStyle(styles: {
      color?: string;
      backgroundColor?: string;
      placeholderColor?: string;
    }): void;

    showAndroidKeyboard(): void;
  }
}
