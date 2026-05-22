import { LinearGradient } from 'expo-linear-gradient';
import type { TabListProps } from 'expo-router/ui';
import { useMemo } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlusIcon } from '@/components/icons/plus-icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FAB_SIZE = 64;

type BottomNavBarProps = TabListProps & {
  onCapturePress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BottomNavBar({ children, onCapturePress, style, ...rest }: BottomNavBarProps) {
  const theme = useTheme();

  const barStyle = useMemo(
    () => [
      styles.bar,
      {
        backgroundColor: theme.navBar,
        borderColor: theme.navBarBorder,
      },
      Platform.select({
        ios: {
          shadowColor: theme.shadow,
        },
        default: {},
      }),
    ],
    [theme.navBar, theme.navBarBorder, theme.shadow],
  );

  const fabShadowStyle = useMemo(
    () =>
      Platform.select({
        ios: {
          shadowColor: theme.fabShadow,
        },
        default: {},
      }),
    [theme.fabShadow],
  );

  return (
    <SafeAreaView
      edges={['bottom']}
      pointerEvents="box-none"
      style={[styles.wrapper, style]}
      {...rest}
    >
      <View style={barStyle}>
        <View style={styles.tabsRow}>{children}</View>
      </View>

      <View style={styles.fabAnchor} pointerEvents="box-none">
        <Pressable
          onPress={onCapturePress}
          style={({ pressed }) => [styles.fabTouchable, pressed && styles.fabPressed]}
          accessibilityRole="button"
          accessibilityLabel="Create note"
        >
          <LinearGradient
            colors={[theme.fabGradientStart, theme.fabGradientEnd]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.fab, fabShadowStyle]}
          >
            <PlusIcon size={28} color={theme.fabForeground} />
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: 28,
    paddingBottom: Spacing.two,
  },
  bar: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.two,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      default: {},
    }),
  },
  tabsRow: {
    position: 'relative',
    height: 40,
    width: '100%',
  },
  fabAnchor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fabTouchable: {
    marginTop: 2,
  },
  fabPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
      },
      android: {
        elevation: 10,
      },
      default: {},
    }),
  },
});
