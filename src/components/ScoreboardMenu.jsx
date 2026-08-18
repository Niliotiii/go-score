import { useEffect, useRef } from 'react'

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ScoreboardMenu({
  swipeUpEnabled,
  onToggleSwipeUp,
  onSwapSides,
  onReset,
  onExit,
  onClose,
}) {
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
      callback?.()
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

    Promise.all([anim1.finished, anim2.finished]).then(() => callback?.())
  }

  const menuItemBase =
    'w-full flex items-center justify-between h-12 px-4 rounded-md bg-transparent text-goscore-fg-dark text-[15px] font-medium border border-goscore-border-dark active:scale-[0.98] transition-transform'

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 px-0 pb-0"
      style={{ opacity: REDUCED_MOTION ? 1 : 0 }}
      onClick={() => closeAnd(onClose)}
      data-od-id="scoreboard-menu"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
    >
      <div
        ref={sheetRef}
        className="w-full max-w-[400px] bg-goscore-surface-dark rounded-t-lg p-5 pb-6"
        style={{ transform: REDUCED_MOTION ? 'translateY(0)' : 'translateY(100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="menu-title" className="text-[17px] font-semibold tracking-tight text-goscore-fg-dark mb-5">
          Opcoes
        </h2>

        <div className="flex flex-col gap-2.5">
          <div
            className={`${menuItemBase} cursor-pointer`}
            onClick={() => closeAnd(onToggleSwipeUp)}
            role="switch"
            aria-checked={swipeUpEnabled}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                closeAnd(onToggleSwipeUp)
              }
            }}
          >
            <span>Swipe +3</span>
            <span
              className={`relative w-11 h-[26px] rounded-full flex-shrink-0 transition-colors duration-200 ${
                swipeUpEnabled ? 'bg-goscore-accent' : 'bg-goscore-border-dark'
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  swipeUpEnabled ? 'translate-x-[18px]' : 'translate-x-0'
                }`}
                style={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.04)',
                }}
              />
            </span>
          </div>

          <button
            type="button"
            className={menuItemBase}
            onClick={() => closeAnd(onSwapSides)}
          >
            <span className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polyline points="7 16 3 12 7 8" />
                <polyline points="17 8 21 12 17 16" />
                <line x1="3" y1="12" x2="21" y2="12" />
              </svg>
              Inverter lados
            </span>
          </button>

          <button
            type="button"
            className={`${menuItemBase} text-goscore-danger border-goscore-danger/20`}
            onClick={() => closeAnd(onReset)}
          >
            <span className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Zerar placar
            </span>
          </button>

          <button
            type="button"
            className={menuItemBase}
            onClick={() => closeAnd(onExit)}
          >
            <span className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sair da partida
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => closeAnd(onClose)}
          className="w-full h-11 mt-5 rounded-sm border border-goscore-border-dark text-goscore-fg-dark text-sm font-medium bg-transparent"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
