import { useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { setInstallPromptDismissed } from '../lib/storage'

export function InstallPrompt() {
  const { variant, promptInstall, setVariant } = useInstallPrompt()
  const [modalVisible, setModalVisible] = useState(false)

  function dismiss() {
    setVariant(null)
    setInstallPromptDismissed()
  }

  async function handleBannerAction() {
    if (variant === 'android') {
      await promptInstall()
      return
    }
    setModalVisible(true)
  }

  if (!variant) return null

  const isIOSInstall = variant === 'install'
  const isSwitchToSafari = variant === 'switch-to-safari'

  const bannerText = isIOSInstall
    ? 'Instale o GoScore na tela de inicio do seu iPhone'
    : isSwitchToSafari
      ? 'Abra este link no Safari para instalar o GoScore como app'
      : 'Instale o GoScore como app no seu celular'

  const actionText = isIOSInstall ? 'Como instalar' : isSwitchToSafari ? 'Como fazer' : 'Instalar'

  return (
    <>
      <div
        className="fixed left-4 right-4 z-40 rounded-lg border border-goscore-border bg-goscore-surface p-3 shadow-lg flex items-center gap-3"
        style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
        data-od-id="install-prompt-banner"
      >
        <div className="text-goscore-accent flex-shrink-0">
          {isSwitchToSafari ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2v20" />
              <path d="M2 12h20" />
              <path d="m4.93 4.93 14.14 14.14" />
              <path d="m19.07 4.93-14.14 14.14" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <path d="M12 18h.01" />
              <path d="m9 9 3 3 3-3" />
            </svg>
          )}
        </div>
        <p className="flex-1 text-sm text-goscore-fg leading-snug">
          {bannerText}
        </p>
        <button
          type="button"
          onClick={handleBannerAction}
          className="text-[13px] font-bold text-goscore-accent flex-shrink-0"
        >
          {actionText}
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fechar aviso"
          className="w-6 h-6 flex items-center justify-center text-goscore-muted flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {modalVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
          onClick={() => setModalVisible(false)}
          data-od-id="install-prompt-modal"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[360px] bg-goscore-surface rounded-lg p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[19px] font-semibold text-goscore-fg">
              {isIOSInstall ? 'Adicionar a tela de inicio' : 'Use o Safari para instalar'}
            </h2>

            {isIOSInstall ? (
              <>
                <Step
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  }
                  text="Toque no icone de Compartilhar na barra do Safari"
                />
                <Step
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  }
                  text='Role a lista e toque em "Adicionar a Tela de Inicio"'
                />
                <Step
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  }
                  text='Toque em "Adicionar" — pronto, o GoScore vira um app na sua tela'
                />
              </>
            ) : (
              <>
                <p className="text-sm text-goscore-fg-secondary leading-relaxed">
                  No iPhone, apenas o <strong className="text-goscore-fg">Safari</strong> consegue instalar o GoScore como app — outros navegadores nao tem essa opcao.
                </p>
                <Step
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  }
                  text="Toque no menu ••• (ou no icone de compartilhar) deste navegador"
                />
                <Step
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2v20" />
                      <path d="M2 12h20" />
                    </svg>
                  }
                  text='Escolha "Abrir no Safari"'
                />
                <Step
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  }
                  text='No Safari, toque em Compartilhar → "Adicionar a Tela de Inicio"'
                />
              </>
            )}

            <button
              type="button"
              onClick={() => setModalVisible(false)}
              className="w-full h-11 mt-1 rounded-md bg-goscore-accent text-white text-[15px] font-semibold flex items-center justify-center active:scale-[0.98] transition-transform"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function Step({ icon, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-sm bg-goscore-bg flex items-center justify-center text-goscore-accent flex-shrink-0">
        {icon}
      </div>
      <p className="text-sm text-goscore-fg-secondary leading-relaxed flex-1 pt-0.5">
        {text}
      </p>
    </div>
  )
}
