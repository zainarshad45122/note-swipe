import Svg, { Path } from 'react-native-svg';

type ChevronRightIconProps = {
  size?: number;
  color: string;
};

export function ChevronRightIcon({ size = 20, color }: ChevronRightIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.5 6.5l5.5 5.5-5.5 5.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
