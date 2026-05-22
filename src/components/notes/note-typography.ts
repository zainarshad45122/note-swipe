export type NoteTypography = {
  fontSize: number;
  lineHeight: number;
};

function lineHeightFor(fontSize: number): number {
  return Math.round(fontSize * 1.38);
}

/** Scales the title down as it gets longer (max 2 lines). */
export function getNoteTitleTypography(text: string): NoteTypography {
  const len = text.trim().length;

  if (len <= 24) {
    return { fontSize: 20, lineHeight: lineHeightFor(20) };
  }
  if (len <= 40) {
    return { fontSize: 18, lineHeight: lineHeightFor(18) };
  }
  if (len <= 60) {
    return { fontSize: 16, lineHeight: lineHeightFor(16) };
  }
  return { fontSize: 14, lineHeight: lineHeightFor(14) };
}

/**
 * Scales body text down as content grows so it stays inside the card.
 * A visible title uses vertical space — long titles nudge body size down slightly.
 */
export function getNoteBodyTypography(
  content: string,
  options?: { hasTitle?: boolean; titleLength?: number },
): NoteTypography {
  let len = content.trim().length;

  if (options?.hasTitle) {
    len += Math.min(options.titleLength ?? 0, 48) * 0.4;
  }

  if (len <= 55) {
    return { fontSize: 26, lineHeight: lineHeightFor(26) };
  }
  if (len <= 95) {
    return { fontSize: 24, lineHeight: lineHeightFor(24) };
  }
  if (len <= 135) {
    return { fontSize: 22, lineHeight: lineHeightFor(22) };
  }
  if (len <= 185) {
    return { fontSize: 20, lineHeight: lineHeightFor(20) };
  }
  if (len <= 245) {
    return { fontSize: 18, lineHeight: lineHeightFor(18) };
  }
  if (len <= 320) {
    return { fontSize: 16, lineHeight: lineHeightFor(16) };
  }
  return { fontSize: 14, lineHeight: lineHeightFor(14) };
}
