import { useEffect, useRef } from 'react'

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function VictoryModal({ team, onRematch, onExit }) {
  const overlayRef = useRef(null)
  const sheetRef = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const sheet = sheetRef.current
    if (!overlay || !sheet) return

    if (REDUCED_MOTION) {
      overlay.style.opacity = '1'
      sheet.style.transform = 'translateY(0)'
      return
    }

    overlay.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 200, easing: 'ease-out', fill: 'forwards' }
    )
    sheet.animate(
      [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
      { duration: 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards', delay: 50 }
    )
  }, [])

  function closeAnd(callback) {
    const overlay = overlayRef.current
    const sheet = sheetRef.current
    if (!overlay || !sheet || REDUCED_MOTION) {
      callback()
      return
    }

    const anim1 = sheet.animate(
      [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }],
      { duration: 200, easing: 'ease-in', fill: 'forwards' }
    )
    const anim2 = overlay.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 180, easing: 'ease-in', fill: 'forwards', delay: 50 }
    )

    Promise.all([anim1.finished, anim2.finished]).then(callback)
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/80 px-0 pb-0 md:px-4 md:pb-0"
      style={{ opacity: REDUCED_MOTION ? 1 : 0 }}
      data-od-id="victory-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
    >
      <div
        ref={sheetRef}
        className="w-full max-w-[400px] bg-goscore-surface-dark rounded-t-lg md:rounded-lg p-7 pb-6"
        style={{ transform: REDUCED_MOTION ? 'translateY(0)' : 'translateY(100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <div className="text-5xl mb-2" aria-hidden="true">
            {team.icon}
          </div>
          <h2
            id="victory-title"
            className="text-[21px] font-semibold tracking-tight text-goscore-fg-dark mb-1"
          >
            {team.name} venceu!
          </h2>
          <p className="text-[13px] text-goscore-muted-dark">
            Fim da partida
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => closeAnd(onExit)}
            className="flex-1 h-11 rounded-sm border border-goscore-border-dark text-goscore-fg-dark text-sm font-medium bg-transparent"
          >
            Sair
          </button>
          <button
            onClick={() => closeAnd(onRematch)}
            className="flex-1 h-11 rounded-sm bg-goscore-accent text-white text-sm font-semibold"
          >
            Revanche
          </button>
        </div>
      </div>
    </div>
  )
}
