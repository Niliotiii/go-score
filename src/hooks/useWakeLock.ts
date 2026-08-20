import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

export function useWakeLock(enabled: boolean = true) {
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || Platform.OS !== 'web') return;

    async function requestLock() {
      if (!('wakeLock' in navigator)) return;
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch {}
    }

    function releaseLock() {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    }

    function handleVisibility() {
      if (document.hidden) {
        releaseLock();
      } else {
        requestLock();
      }
    }

    requestLock();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      releaseLock();
    };
  }, [enabled]);
}
