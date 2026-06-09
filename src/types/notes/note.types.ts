import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type Note = {
  id: string;
  title?: string;
  content: string;
  textColor?: string;
  createdAt: string;
  notebookId: string;
  notebookName?: string;
};

export type NoteProps = Pick<
  Note,
  'title' | 'content' | 'textColor' | 'createdAt' | 'notebookName'
> & {
  // UI-only style prop for Note component composition.
  style?: StyleProp<ViewStyle>;
};

export type CreateNoteInput = {
  title?: string;
  content: string;
  textColor?: string;
  notebookId: string;
  notebookName?: string;
};

export type NoteSurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export type NoteTypography = {
  fontSize: number;
  lineHeight: number;
};
