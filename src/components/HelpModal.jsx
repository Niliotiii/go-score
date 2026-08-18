import { useEffect, useRef } from 'react'

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function HelpModal({ onClose }) {
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

  function closeAnd() {
    const overlay = overlayRef.current
    const sheet = sheetRef.current
    if (!overlay || !sheet || REDUCED_MOTION) {
      onClose()
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

    Promise.all([anim1.finished, anim2.finished]).then(() => onClose())
  }

  const instructions = [
    {
      title: 'Relogio',
      description: 'Toque no centro do tempo para iniciar ou pausar. Pressione e segure por 5 segundos para zerar.',
    },
    {
      title: 'Marcador de sets',
      description: 'Toque nos pontinhos na parte superior para adicionar 1 set. Pressione e segure para remover 1 set.',
    },
    {
      title: 'Marcador de pontos',
      description: 'Toque no placar para +1 ponto. Arraste para cima para +3 (se o Swipe +3 estiver ligado). Arraste para baixo para -1.',
    },
  ]

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 px-0 pb-0"
      style={{ opacity: REDUCED_MOTION ? 1 : 0 }}
      onClick={() => closeAnd()}
      data-od-id="help-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div
        ref={sheetRef}
        className="w-full max-w-[400px] bg-goscore-surface-dark rounded-t-lg p-5 pb-6"
        style={{ transform: REDUCED_MOTION ? 'translateY(0)' : 'translateY(100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="help-title" className="text-[17px] font-semibold tracking-tight text-goscore-fg-dark mb-5">
          Como usar
        </h2>

        <div className="flex flex-col gap-4">
          {instructions.map((item) => (
            <div key={item.title}>
              <h3 className="text-[15px] font-semibold text-goscore-fg-dark mb-1">{item.title}</h3>
              <p className="text-[13px] text-goscore-muted-dark leading-snug">{item.description}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => closeAnd()}
          className="w-full h-11 mt-6 rounded-sm border border-goscore-border-dark text-goscore-fg-dark text-sm font-medium bg-transparent"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
