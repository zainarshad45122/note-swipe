import Svg, { Path, Rect } from 'react-native-svg';

type NotebookIconProps = {
  size?: number;
  color: string;
};

export function NotebookIcon({ size = 24, color }: NotebookIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="3" width="14" height="18" rx="2" stroke={color} strokeWidth={2} />
      <Path d="M8 7H14" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 11H14" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 15H12" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M18 5V19" stroke={color} strokeWidth={2} />
    </Svg>
  );
}
