import { useEffect, useRef } from 'react'
import NoSleep from 'nosleep.js'

export function useWakeLock(enabled = true) {
  const wakeLockRef = useRef(null)
  const noSleepRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    async function requestNativeLock() {
      if (!('wakeLock' in navigator)) return false
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
        return true
      } catch {
        return false
      }
    }

    function releaseNativeLock() {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {})
        wakeLockRef.current = null
      }
    }

    function startNoSleep() {
      if (noSleepRef.current) return
      try {
        noSleepRef.current = new NoSleep()
        noSleepRef.current.enable()
      } catch {
        noSleepRef.current = null
      }
    }

    function stopNoSleep() {
      if (noSleepRef.current) {
        noSleepRef.current.disable()
        noSleepRef.current = null
      }
    }

    async function handleVisibilityChange() {
      if (document.hidden) {
        releaseNativeLock()
        return
      }

      const nativeActive = await requestNativeLock()
      if (!nativeActive) {
        startNoSleep()
      }
    }

    handleVisibilityChange()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      releaseNativeLock()
      stopNoSleep()
    }
  }, [enabled])
}
