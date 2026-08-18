import { useEffect, useRef } from 'react'

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ResetModal({ onCancel, onConfirm }) {
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 px-0 pb-0"
      style={{ opacity: REDUCED_MOTION ? 1 : 0 }}
      onClick={() => closeAnd(onCancel)}
      data-od-id="reset-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div
        ref={sheetRef}
        className="w-full max-w-[400px] bg-goscore-surface-dark rounded-t-lg p-7 pb-6"
        style={{ transform: REDUCED_MOTION ? 'translateY(0)' : 'translateY(100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-[17px] font-semibold tracking-tight text-goscore-fg-dark mb-1.5">
          Zerar tudo?
        </h2>
        <p id="modal-desc" className="text-sm text-goscore-muted-dark mb-6 leading-relaxed">
          Pontos e sets voltam a zero. Nao pode ser desfeito.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={() => closeAnd(onCancel)}
            className="flex-1 h-11 rounded-sm border border-goscore-border-dark text-goscore-fg-dark text-sm font-medium bg-transparent"
          >
            Cancelar
          </button>
          <button
            onClick={() => closeAnd(onConfirm)}
            className="flex-1 h-11 rounded-sm bg-goscore-danger text-white text-sm font-semibold"
          >
            Zerar
          </button>
        </div>
      </div>
    </div>
  )
}
