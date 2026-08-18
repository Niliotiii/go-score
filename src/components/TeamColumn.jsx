import { useEffect, useRef, useState } from 'react'
import { useSwipe } from '../hooks/useSwipe'

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function mixWithDark(color) {
  return `color-mix(in srgb, ${color} 80%, var(--bg-dark))`
}

export function TeamColumn({
  team,
  score,
  setsWon,
  swipeUpEnabled,
  onScore,
  onSetChange,
  isLandscape,
  flashRef: externalFlashRef,
}) {
  const [flash, setFlash] = useState({ active: false, positive: true })
  const localFlashRef = useRef(null)
  const scoreRef = useRef(null)
  const setsAreaRef = useRef(null)

  const flashRefCallback = (el) => {
    localFlashRef.current = el
    if (typeof externalFlashRef === 'function') externalFlashRef(el)
  }

  const { onTouchStart, onTouchEnd } = useSwipe({
    onTap: () => handleScore(1),
    onSwipeUp: () => handleScore(3),
    onSwipeDown: () => handleScore(-1),
    disabled: false,
  })

  const setPointerRef = useRef({ t: 0, y: 0, timer: null, handled: false })

  function handleSetPointerDown(e) {
    e.stopPropagation?.()
    setPointerRef.current = {
      t: Date.now(),
      y: e.clientY,
      timer: setTimeout(() => {
        setPointerRef.current.timer = null
        onSetChange?.(-1)
      }, 600),
      handled: false,
    }
  }

  function handleSetPointerUp(e) {
    e.stopPropagation?.()
    if (setPointerRef.current.timer) {
      clearTimeout(setPointerRef.current.timer)
      setPointerRef.current.timer = null
    }
    const dy = setPointerRef.current.y - e.clientY
    const elapsed = Date.now() - setPointerRef.current.t
    if (elapsed < 600 && Math.abs(dy) < 20 && !setPointerRef.current.handled) {
      setPointerRef.current.handled = true
      onSetChange?.(1)
    }
  }

  function handleSetPointerCancel() {
    if (setPointerRef.current.timer) {
      clearTimeout(setPointerRef.current.timer)
      setPointerRef.current.timer = null
    }
  }

  function handleScore(delta) {
    if (delta === 3 && !swipeUpEnabled) return
    const adjusted = delta === -1 && score === 0 ? 0 : delta
    onScore(adjusted)
    if (adjusted !== 0) triggerFeedback(adjusted > 0)
  }

  function triggerFeedback(positive) {
    setFlash({ active: true, positive })
    setTimeout(() => setFlash((f) => ({ ...f, active: false })), 320)

    if (scoreRef.current && !REDUCED_MOTION) {
      scoreRef.current.style.transform = 'scale(1.12)'
      scoreRef.current.style.transition = 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)'
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (scoreRef.current) {
            scoreRef.current.style.transform = 'scale(1)'
          }
        }, 50)
      })
    }
  }

  useEffect(() => {
    if (!localFlashRef.current) return
    localFlashRef.current.style.opacity = flash.active ? (flash.positive ? '0.5' : '0.4') : '0'
  }, [flash])

  return (
    <div
      onTouchStart={(e) => {
        if (setsAreaRef.current && setsAreaRef.current.contains(e.target)) return
        onTouchStart(e)
      }}
      onTouchEnd={onTouchEnd}
      role="button"
      tabIndex={0}
      aria-label={`${team.name}: ${score} pontos. Toque +1${
        swipeUpEnabled ? ', arraste cima +3' : ''
      }, arraste baixo -1`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleScore(1)
        }
      }}
      data-od-id={`team-col-${team.name.toLowerCase().replace(/\s+/g, '-')}`}
      className="flex-1 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer"
      style={{ background: mixWithDark(team.color) }}
    >
      <div
        ref={flashRefCallback}
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          flash.positive ? 'bg-white/15' : 'bg-goscore-danger/20'
        }`}
        style={{ opacity: 0 }}
        aria-hidden="true"
      />

      <div
        ref={setsAreaRef}
        className={`absolute flex items-center gap-2 ${
          isLandscape ? 'top-1.5 p-2' : 'top-2 p-3'
        } touch-none`}
        onPointerDown={handleSetPointerDown}
        onPointerUp={handleSetPointerUp}
        onPointerCancel={handleSetPointerCancel}
        onPointerLeave={handleSetPointerCancel}
        onContextMenu={(e) => e.preventDefault()}
        role="button"
        tabIndex={0}
        aria-label={`${setsWon} sets. Toque adiciona 1 set, toque longo remove 1 set`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSetChange?.(1)
          }
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`rounded-full ${
              isLandscape ? 'w-3 h-3' : 'w-4 h-4'
            } ${
              i < setsWon
                ? 'bg-white/90'
                : 'bg-white/15 border border-white/10'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      <div
        className={`mb-1 opacity-90 ${isLandscape ? 'text-base mb-0.5' : 'text-xl'}`}
        aria-hidden="true"
      >
        {team.icon}
      </div>
      <div className="text-[11px] font-semibold tracking-label uppercase text-white/55 mb-1 leading-none">
        {team.name}
      </div>
      <div
        ref={scoreRef}
        className={`font-mono font-bold tracking-score tabular-nums text-goscore-fg-dark leading-none ${
          score === 0 ? 'opacity-30' : 'opacity-100'
        } ${
          isLandscape
            ? 'text-[clamp(56px,24vw,104px)]'
            : 'text-[clamp(68px,32vmin,150px)]'
        }`}
        aria-live="polite"
        aria-atomic="true"
      >
        {score}
      </div>
    </div>
  )
}
