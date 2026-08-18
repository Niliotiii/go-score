import { useRef } from 'react'

export function useSwipe({ onTap, onSwipeUp, onSwipeDown, disabled = false }) {
  const startRef = useRef({ t: 0, y: 0 })

  function handleStart(e) {
    if (disabled) return
    const touch = e.touches?.[0] || e
    startRef.current = { t: Date.now(), y: touch.clientY }
  }

  function handleEnd(e) {
    if (disabled) return
    const touch = e.changedTouches?.[0] || e
    const dy = startRef.current.y - touch.clientY
    const elapsed = Date.now() - startRef.current.t

    if (Math.abs(dy) > 40 && elapsed < 400) {
      if (dy > 0) onSwipeUp?.()
      else onSwipeDown?.()
      return
    }

    if (elapsed < 300 && Math.abs(dy) < 20) {
      onTap?.()
    }
  }

  return { onTouchStart: handleStart, onTouchEnd: handleEnd }
}
