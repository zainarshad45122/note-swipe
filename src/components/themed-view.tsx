import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  /** Theme token for backgroundColor */
  type?: ThemeColor;
  /** Theme token for borderColor */
  borderType?: ThemeColor;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type,
  borderType,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        { backgroundColor: theme[type ?? 'background'] },
        borderType ? { borderColor: theme[borderType] } : null,
        style,
      ]}
      {...otherProps}
    />
  );
}
