import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, default to light until the client has hydrated.
 */
function subscribe() {
  return () => {};
}

export function useColorScheme() {
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const colorScheme = useRNColorScheme();

  if (!isHydrated) {
    return 'light';
  }

  return colorScheme ?? 'light';
}
