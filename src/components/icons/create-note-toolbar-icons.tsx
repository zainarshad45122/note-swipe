import Svg, { Circle, Path, Rect } from 'react-native-svg';

type IconProps = {
  size?: number;
  color: string;
};

export function CreateNoteIcon({ size = 20, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="3.5" width="14" height="17" rx="2.5" stroke={color} strokeWidth={1.75} />
      <Path d="M9 8h6" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M9 11.5h4" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M12 15.5v4.5" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M9.5 18h5" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
    </Svg>
  );
}

export function EditorAaIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.5 17.5 10.5 12h3l2 5.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M11 12h2.5" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path
        d="M15.5 17.5 17.5 12h3l2 5.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M18 12h2.5" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
    </Svg>
  );
}

export function EditorBulletListIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="5.5" cy="7.5" r="1.25" fill={color} />
      <Circle cx="5.5" cy="12" r="1.25" fill={color} />
      <Circle cx="5.5" cy="16.5" r="1.25" fill={color} />
      <Path d="M9.5 7.5H19" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M9.5 12H19" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M9.5 16.5H19" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
    </Svg>
  );
}

export function EditorNumberedListIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.5 7h1.5M5.5 12h1.5M5.5 16.5h1.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <Path d="M9.5 7H19" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M9.5 12H19" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M9.5 16.5H19" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
    </Svg>
  );
}

export function EditorImageIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4.5" y="5.5" width="15" height="13" rx="2.5" stroke={color} strokeWidth={1.75} />
      <Circle cx="9" cy="10" r="1.5" fill={color} />
      <Path
        d="M6.5 16.5 10.5 12.5l2.5 2.5 2-2 3.5 3.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function EditorMicIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="4.5" width="6" height="10" rx="3" stroke={color} strokeWidth={1.75} />
      <Path
        d="M6.5 11.5a5.5 5.5 0 0 0 11 0"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <Path d="M12 17v2.5" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M9.5 19.5h5" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
    </Svg>
  );
}

export function EditorEmojiIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.75} />
      <Circle cx="9" cy="10" r="1" fill={color} />
      <Circle cx="15" cy="10" r="1" fill={color} />
      <Path
        d="M9 14.5c.9 1.2 2 1.8 3 1.8s2.1-.6 3-1.8"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    </Svg>
  );
}
