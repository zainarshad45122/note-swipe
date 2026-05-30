import Svg, { Circle, Path } from 'react-native-svg';

type SearchIconProps = {
  size?: number;
  color: string;
};

export function SearchIcon({ size = 20, color }: SearchIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={2} />
      <Path d="M20 20L17 17" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
