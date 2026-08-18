import { formatTime } from '../lib/utils'
import { useLongPress } from '../hooks/useLongPress'

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function TimerBar({ timer, running, onToggle, onReset, isLandscape }) {
  const { start, end, progressRef } = useLongPress({
    onPressStart: () => {},
    onPressEnd: (_e, elapsed) => {
      if (elapsed >= 5000) {
        onReset()
      }
    },
    onShortPress: onToggle,
    duration: 5000,
  })

  return (
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
      data-od-id="timer-bar"
      className={`relative flex items-center justify-center flex-shrink-0 cursor-pointer border-b border-goscore-border-dark ${
        isLandscape ? 'h-8' : 'h-11'
      }`}
    >
      <span
        className={`font-mono text-lg font-semibold tracking-timer tabular-nums leading-none ${
          running ? 'text-goscore-fg-dark' : 'text-goscore-muted-dark'
        } ${isLandscape ? 'text-[15px]' : ''}`}
      >
        {formatTime(timer)}
      </span>
      <div
        className={`w-1.5 h-1.5 rounded-full ml-2 ${
          running ? 'bg-goscore-accent' : 'bg-transparent'
        }`}
        aria-hidden="true"
      />
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
