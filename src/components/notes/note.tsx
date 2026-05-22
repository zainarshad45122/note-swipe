import { useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { CalendarIcon } from '@/components/icons/calendar-icon';
import { NotebookPill } from '@/components/notes/notebook-pill';
import { NoteSurface } from '@/components/notes/note-surface';
import { getNoteBodyTypography, getNoteTitleTypography } from '@/components/notes/note-typography';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type NoteProps = {
  title?: string;
  content: string;
  createdAt: Date | string;
  notebookName?: string;
  style?: StyleProp<ViewStyle>;
};

function formatCreatedAt(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function Note({ title, content, createdAt, notebookName, style }: NoteProps) {
  const theme = useTheme();
  const titleText = title?.trim() ?? '';
  const contentText = content.trim();
  const hasTitle = Boolean(titleText);
  const hasContent = Boolean(contentText);
  const notebookLabel = notebookName?.trim();

  const titleTypography = useMemo(
    () => (hasTitle ? getNoteTitleTypography(titleText) : null),
    [hasTitle, titleText],
  );
  const bodyTypography = useMemo(
    () =>
      getNoteBodyTypography(hasContent ? contentText : 'Empty note', {
        hasTitle,
        titleLength: titleText.length,
      }),
    [contentText, hasContent, hasTitle, titleText.length],
  );

  return (
    <NoteSurface style={style}>
      <View style={styles.layout}>
        <View style={styles.header}>
          {notebookLabel ? (
            <NotebookPill name={notebookLabel} />
          ) : (
            <View style={styles.headerSpacer} />
          )}
          <ThemedText themeColor="textSecondary" style={styles.menu}>
            •••
          </ThemedText>
        </View>

        <View style={styles.bodySection}>
          {hasTitle && titleTypography ? (
            <ThemedText
              style={[styles.title, titleTypography]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {titleText}
            </ThemedText>
          ) : null}
          <ThemedText
            themeColor={hasContent ? 'text' : 'textSecondary'}
            style={[styles.body, bodyTypography, !hasTitle && styles.bodyOnly]}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {hasContent ? contentText : 'Empty note'}
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <CalendarIcon size={16} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary" style={styles.createdAtText}>
            {formatCreatedAt(createdAt)}
          </ThemedText>
        </View>
      </View>
    </NoteSurface>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    minHeight: 352,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    flex: 1,
  },
  menu: {
    fontSize: 18,
    letterSpacing: 2,
    lineHeight: 22,
  },
  bodySection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
  title: {
    fontWeight: '600',
    marginBottom: Spacing.three,
  },
  body: {
    fontWeight: '700',
  },
  bodyOnly: {
    marginTop: 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  createdAtText: {
    flex: 1,
  },
});
