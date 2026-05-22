import Svg, { Path, Rect } from 'react-native-svg';

type CalendarIconProps = {
  size?: number;
  color: string;
};

export function CalendarIcon({ size = 16, color }: CalendarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth={2} />
      <Path d="M16 3V7" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 3V7" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M3 10H21" stroke={color} strokeWidth={2} />
    </Svg>
  );
}
