import { useRef, useCallback } from 'react';
import { GestureResponderEvent } from 'react-native';

interface UseLongPressOptions {
  onShortPress?: () => void;
  onLongPress?: () => void;
  duration?: number;
  onProgress?: (progress: number) => void;
}

export function useLongPress({
  onShortPress,
  onLongPress,
  duration = 5000,
  onProgress,
}: UseLongPressOptions) {
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const animate = useCallback(() => {
    if (!startRef.current) return;
    const elapsed = Date.now() - startRef.current;
    const pct = Math.min(elapsed / duration, 1);
    onProgress?.(pct);
    if (pct >= 1) {
      completedRef.current = true;
      onLongPress?.();
      startRef.current = 0;
      return;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [duration, onProgress, onLongPress]);

  const onResponderGrant = useCallback((_e: GestureResponderEvent) => {
    startRef.current = Date.now();
    completedRef.current = false;
    onProgress?.(0);
    rafRef.current = requestAnimationFrame(animate);
  }, [animate, onProgress]);

  const onResponderRelease = useCallback((_e: GestureResponderEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (!startRef.current && !completedRef.current) return;
    const elapsed = startRef.current ? Date.now() - startRef.current : duration;
    startRef.current = 0;
    onProgress?.(0);

    if (!completedRef.current && elapsed < 300) {
      onShortPress?.();
    }
  }, [onShortPress, onProgress, duration]);

  return {
    onStartShouldSetResponder: () => true,
    onResponderGrant,
    onResponderRelease,
    onResponderTerminate: onResponderRelease,
  };
}
