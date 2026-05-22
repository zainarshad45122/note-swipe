import Svg, { Path } from 'react-native-svg';

type HomeIconProps = {
  size?: number;
  color: string;
};

export function HomeIcon({ size = 24, color }: HomeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V14H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
        fill={color}
      />
    </Svg>
  );
}
