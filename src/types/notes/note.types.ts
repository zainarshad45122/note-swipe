import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type NoteProps = {
  title?: string;
  content: string;
  createdAt: Date | string;
  notebookName?: string;
  style?: StyleProp<ViewStyle>;
};

export type NoteSurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export type NoteTypography = {
  fontSize: number;
  lineHeight: number;
};
