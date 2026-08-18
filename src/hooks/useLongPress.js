import { useCallback, useRef } from 'react'

export function useLongPress({
  onPressStart,
  onPressEnd,
  onShortPress,
  duration = 5000,
}) {
  const startRef = useRef(0)
  const progressRef = useRef(null)
  const rafRef = useRef(null)

  const animateProgress = useCallback(() => {
    if (!progressRef.current || !startRef.current) return
    const elapsed = Date.now() - startRef.current
    const pct = Math.min(elapsed / duration, 1)
    progressRef.current.style.transform = `scaleX(${pct})`
    if (pct < 1) {
      rafRef.current = requestAnimationFrame(animateProgress)
    }
  }, [duration])

  function start(e) {
    e.preventDefault?.()
    startRef.current = Date.now()
    onPressStart?.(e)
    if (progressRef.current) {
      progressRef.current.style.transform = 'scaleX(0)'
      rafRef.current = requestAnimationFrame(animateProgress)
    }
  }

  function end(e) {
    e.preventDefault?.()
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const elapsed = startRef.current ? Date.now() - startRef.current : 0
    onPressEnd?.(e, elapsed)
    if (progressRef.current) {
      progressRef.current.style.transition = 'transform 120ms ease-out'
      progressRef.current.style.transform = 'scaleX(0)'
      setTimeout(() => {
        if (progressRef.current) progressRef.current.style.transition = ''
      }, 120)
    }
    if (elapsed < 300) {
      onShortPress?.()
    }
    startRef.current = 0
  }

  return { start, end, progressRef }
}
