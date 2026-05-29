import Svg, { Circle, Path } from 'react-native-svg';

type ColorPaletteIconProps = {
  size?: number;
  color: string;
};

export function ColorPaletteIcon({ size = 22, color }: ColorPaletteIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5c-4.42 0-8 3.13-8 7a6.5 6.5 0 0 0 2.35 5.02c.72.62 1.15 1.52 1.15 2.48v.75c0 .69.56 1.25 1.25 1.25H9a1.25 1.25 0 0 0 1.25-1.25v-.5c0-.83.67-1.5 1.5-1.5h.75c2.9 0 5.25-2.35 5.25-5.25 0-4.42-3.13-8-5.75-8Z"
        stroke={color}
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <Circle cx="8.25" cy="10" r="1" fill={color} />
      <Circle cx="11.25" cy="7.75" r="1" fill={color} />
      <Circle cx="14.75" cy="9.25" r="1" fill={color} />
      <Circle cx="13.5" cy="12.75" r="1" fill={color} />
    </Svg>
  );
}
