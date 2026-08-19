import { formatTime, triggerHaptic } from '../lib/utils'
import { playClickSound } from '../lib/audio'
import { useLongPress } from '../hooks/useLongPress'

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function TimerBar({ timer, running, onToggle, onReset, isLandscape, leftAction, children }) {
  const { start, end, progressRef } = useLongPress({
    onPressStart: () => {},
    onPressEnd: (_e, elapsed) => {
      if (elapsed >= 5000) {
        triggerHaptic(30)
        playClickSound('set')
        onReset()
      }
    },
    onShortPress: () => {
      triggerHaptic(10)
      playClickSound('point')
      onToggle()
    },
    duration: 5000,
  })

  return (
    <div
      data-od-id="timer-bar"
      className={`relative flex items-center justify-between flex-shrink-0 border-b border-goscore-border-dark px-6 ${
        isLandscape ? 'h-11' : 'h-14'
      }`}
    >
      {leftAction ? (
        <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">{leftAction}</div>
      ) : (
        <div className="w-9 flex-shrink-0" aria-hidden="true" />
      )}

      <div
        onTouchStart={start}
        onTouchEnd={end}
        onMouseDown={start}
        onMouseUp={end}
        onMouseLeave={end}
        onContextMenu={(e) => e.preventDefault()}
        role="timer"
        aria-label={`Cronometro: ${formatTime(timer)}. ${running ? 'Em andamento' : 'Pausado'}.`}
        aria-live="off"
        className="flex flex-1 items-center justify-center cursor-pointer h-full"
      >
        <span
          className={`font-mono font-semibold tracking-timer tabular-nums leading-none ${
            running ? 'text-goscore-fg-dark' : 'text-goscore-muted-dark'
          } ${isLandscape ? 'text-xl' : 'text-2xl'}`}
        >
          {formatTime(timer)}
        </span>
        <div
          className={`w-1.5 h-1.5 rounded-full ml-2 ${
            running ? 'bg-goscore-accent' : 'bg-transparent'
          }`}
          aria-hidden="true"
        />
      </div>

      {children && (
        <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">{children}</div>
      )}

      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 h-0.5 w-full bg-goscore-danger origin-left"
        style={{
          transform: 'scaleX(0)',
          transition: REDUCED_MOTION ? 'none' : undefined,
        }}
        aria-hidden="true"
      />
    </div>
  )
}
