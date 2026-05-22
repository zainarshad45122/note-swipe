import Svg, { Path } from 'react-native-svg';

type PlusIconProps = {
  size?: number;
  color: string;
};

export function PlusIcon({ size = 24, color }: PlusIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5V19" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M5 12H19" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}
