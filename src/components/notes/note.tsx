import { useMemo, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { CalendarIcon } from '@/components/icons/calendar-icon';
import { NotebookPill } from '@/components/notebook-pill';
import { stripHtmlToText } from '@/components/notes/note-content';
import { NoteHtmlBody } from '@/components/notes/note-html-body';
import { NoteSurface } from '@/components/notes/note-surface';
import { getNoteBodyTypography, getNoteTitleTypography } from '@/components/notes/note-typography';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { NoteProps } from '@/types/notes/note.types';

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

export function Note({ title, content, textColor, createdAt, notebookName, style }: NoteProps) {
  const theme = useTheme();
  const [htmlBodyHeight, setHtmlBodyHeight] = useState(0);
  const titleText = title?.trim() ?? '';
  const plainContent = stripHtmlToText(content);
  const hasTitle = Boolean(titleText);
  const hasContent = Boolean(plainContent);
  const notebookLabel = notebookName?.trim();
  const bodyColor = textColor ?? (hasContent ? theme.text : theme.textSecondary);

  const titleTypography = useMemo(
    () => (hasTitle ? getNoteTitleTypography(titleText) : null),
    [hasTitle, titleText],
  );
  const bodyTypography = useMemo(
    () =>
      getNoteBodyTypography(hasContent ? plainContent : 'Empty note', {
        hasTitle,
        titleLength: titleText.length,
      }),
    [hasContent, hasTitle, plainContent, titleText.length],
  );

  const handleHtmlBodyLayout = (event: LayoutChangeEvent) => {
    setHtmlBodyHeight(event.nativeEvent.layout.height);
  };

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
          <View style={styles.htmlBodyContainer} onLayout={handleHtmlBodyLayout}>
            {hasContent ? (
              <NoteHtmlBody
                html={content}
                textColor={bodyColor}
                backgroundColor={theme.backgroundElement}
                fontSize={bodyTypography.fontSize}
                lineHeight={bodyTypography.lineHeight}
                height={htmlBodyHeight}
              />
            ) : (
              <ThemedText themeColor="textSecondary" style={[styles.body, bodyTypography]}>
                Empty note
              </ThemedText>
            )}
          </View>
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
    minHeight: 0,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingVertical: Spacing.six,
  },
  title: {
    fontWeight: '600',
    marginBottom: Spacing.three,
  },
  body: {
    fontWeight: '700',
  },
  htmlBodyContainer: {
    flex: 1,
    minHeight: 0,
    width: '100%',
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
