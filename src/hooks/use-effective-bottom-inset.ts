import { Platform } from 'react-native';
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';

const ANDROID_NAV_BAR_FALLBACK = 48;

export function useEffectiveBottomInset() {
  const insets = useSafeAreaInsets();
  const initialBottom = initialWindowMetrics?.insets.bottom ?? 0;
  const reportedBottom = Math.max(insets.bottom, initialBottom);

  if (reportedBottom > 0) {
    return reportedBottom;
  }

  if (Platform.OS === 'android') {
    return ANDROID_NAV_BAR_FALLBACK;
  }

  return 0;
}
