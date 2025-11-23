import { useCallback } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error';

export function useHapticFeedback() {
  const vibrate = useCallback((pattern: HapticPattern) => {
    if (!('vibrate' in navigator)) return;

    const patterns = {
      light: 10,
      medium: 20,
      heavy: 50,
      success: [10, 30, 10, 30, 10],
      error: [20, 10, 20],
    };

    navigator.vibrate(patterns[pattern]);
  }, []);

  return { vibrate };
}
