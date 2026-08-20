import { useRef, useCallback } from 'react';
import { GestureResponderEvent } from 'react-native';

interface UseSwipeOptions {
  onTap?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  disabled?: boolean;
}

export function useSwipe({ onTap, onSwipeUp, onSwipeDown, disabled = false }: UseSwipeOptions) {
  const startRef = useRef({ t: 0, y: 0 });

  const onResponderGrant = useCallback((e: GestureResponderEvent) => {
    if (disabled) return;
    startRef.current = {
      t: Date.now(),
      y: e.nativeEvent.pageY,
    };
  }, [disabled]);

  const onResponderRelease = useCallback((e: GestureResponderEvent) => {
    if (disabled) return;
    if (!startRef.current.t) return;

    const dy = startRef.current.y - e.nativeEvent.pageY;
    const elapsed = Date.now() - startRef.current.t;
    startRef.current = { t: 0, y: 0 };

    if (Math.abs(dy) > 40 && elapsed < 400) {
      if (dy > 0) onSwipeUp?.();
      else onSwipeDown?.();
      return;
    }

    if (elapsed < 300 && Math.abs(dy) < 20) {
      onTap?.();
    }
  }, [disabled, onTap, onSwipeUp, onSwipeDown]);

  return {
    onStartShouldSetResponder: () => !disabled,
    onMoveShouldSetResponder: () => !disabled,
    onResponderGrant,
    onResponderRelease,
  };
}
