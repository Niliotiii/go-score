import { useEffect, useRef } from 'react'

export function useWakeLock(enabled = true) {
  const wakeLockRef = useRef(null)

  useEffect(() => {
    if (!enabled) return
    if (!('wakeLock' in navigator)) return

    async function requestLock() {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      } catch {
        // Ignora erros (permissão negada, bateria baixa, etc.)
      }
    }

    function releaseLock() {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {})
        wakeLockRef.current = null
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        releaseLock()
      } else {
        requestLock()
      }
    }

    requestLock()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      releaseLock()
    }
  }, [enabled])
}
