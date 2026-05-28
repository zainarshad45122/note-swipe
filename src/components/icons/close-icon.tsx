import Svg, { Path } from 'react-native-svg';

type CloseIconProps = {
  size?: number;
  color: string;
};

export function CloseIcon({ size = 16, color }: CloseIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6L18 18" stroke={color} strokeWidth={2.25} strokeLinecap="round" />
      <Path d="M18 6L6 18" stroke={color} strokeWidth={2.25} strokeLinecap="round" />
    </Svg>
  );
}
