import Svg, { Path, Rect } from 'react-native-svg';

type NotebookSelectIconProps = {
  size?: number;
  color: string;
};

export function NotebookSelectIcon({ size = 22, color }: NotebookSelectIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5.5" y="3.5" width="13" height="17" rx="2.5" stroke={color} strokeWidth={1.75} />
      <Path d="M9 8h4.5" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
      <Path d="M16.5 7.5h1.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M16.5 11h1.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M16.5 14.5h1.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
