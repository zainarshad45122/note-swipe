import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

type NoteHtmlBodyProps = {
  html: string;
  textColor: string;
  backgroundColor: string;
  fontSize: number;
  lineHeight: number;
  height: number;
};

function buildNoteHtmlDocument({
  html,
  textColor,
  backgroundColor,
  fontSize,
  lineHeight,
  height,
}: NoteHtmlBodyProps) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <style>
      * {
        box-sizing: border-box;
      }
      html,
      body {
        margin: 0;
        padding: 0;
        background: transparent;
        overflow: hidden;
        -webkit-text-size-adjust: 100%;
      }
      .note-content {
        font-size: ${fontSize}px;
        line-height: ${lineHeight}px;
        color: ${textColor};
        font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        font-weight: 700;
        max-height: ${height}px;
        overflow: hidden;
        position: relative;
        word-break: break-word;
      }
      .note-content p {
        margin: 0 0 0.5em;
      }
      .note-content p:last-child {
        margin-bottom: 0;
      }
      .note-content ul,
      .note-content ol {
        margin: 0;
        padding-left: 1.25em;
      }
      .note-content strong,
      .note-content b {
        font-weight: 700;
      }
      .note-content em,
      .note-content i {
        font-style: italic;
      }
      .ellipsis {
        display: none;
        position: absolute;
        bottom: 0;
        right: 0;
        padding-left: 16px;
        background: linear-gradient(to right, transparent, ${backgroundColor} 55%);
        color: ${textColor};
        font-weight: 700;
        line-height: ${lineHeight}px;
      }
      .note-content.is-truncated .ellipsis {
        display: inline;
      }
    </style>
  </head>
  <body>
    <div class="note-content" id="content">
      ${html}
      <span class="ellipsis">…</span>
    </div>
    <script>
      (function () {
        var el = document.getElementById('content');
        if (el && el.scrollHeight > el.clientHeight + 1) {
          el.classList.add('is-truncated');
        }
      })();
    </script>
  </body>
</html>`;
}

export function NoteHtmlBody({
  html,
  textColor,
  backgroundColor,
  fontSize,
  lineHeight,
  height,
}: NoteHtmlBodyProps) {
  const source = useMemo(
    () => ({
      html: buildNoteHtmlDocument({
        html,
        textColor,
        backgroundColor,
        fontSize,
        lineHeight,
        height,
      }),
    }),
    [backgroundColor, fontSize, height, html, lineHeight, textColor],
  );

  if (height <= 0) {
    return null;
  }

  return (
    <WebView
      source={source}
      style={[styles.webview, { height }]}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      originWhitelist={['*']}
      pointerEvents="none"
      nestedScrollEnabled={false}
      androidLayerType="hardware"
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    backgroundColor: 'transparent',
  },
});
