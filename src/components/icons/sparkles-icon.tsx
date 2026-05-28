import Svg, { Path } from 'react-native-svg';

type SparklesIconProps = {
  size?: number;
  color: string;
};

export function SparklesIcon({ size = 16, color }: SparklesIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.5L13.9 7.1L18.5 9L13.9 10.9L12 15.5L10.1 10.9L5.5 9L10.1 7.1L12 2.5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 14L19.3 16L21.3 16.8L19.3 17.6L18.5 19.6L17.7 17.6L15.7 16.8L17.7 16L18.5 14Z"
        fill={color}
      />
    </Svg>
  );
}
