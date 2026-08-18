import { useState } from 'react'
import { DEFAULT_TEAMS } from '../lib/constants'
import { TeamStepCard } from '../components/TeamStepCard'

export function SetupScreen({ onStart, onBack, isLandscape }) {
  const [step, setStep] = useState(0)
  const [teams, setTeams] = useState(() => DEFAULT_TEAMS.map((t) => ({ ...t })))
  const [swipeUp, setSwipeUp] = useState(true)

  const TOTAL_STEPS = 3

  function updateTeam(idx, field, value) {
    setTeams((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)))
  }

  function nextStep() {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1)
  }

  function prevStep() {
    if (step > 0) setStep((s) => s - 1)
    else onBack()
  }

  return (
    <div
      className="flex flex-col h-full bg-goscore-bg overflow-hidden"
      style={{
        paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: isLandscape ? 'calc(env(safe-area-inset-left, 0px) + 16px)' : '20px',
        paddingRight: isLandscape ? 'calc(env(safe-area-inset-right, 0px) + 16px)' : '20px',
      }}
      data-od-id="setup-screen"
      role="form"
      aria-label="Configurar partida"
    >
      <header
        className={`flex items-center gap-2.5 flex-shrink-0 ${
          isLandscape ? 'mb-2' : 'mb-4'
        }`}
      >
        <button
          type="button"
          onClick={prevStep}
          aria-label={step === 0 ? 'Voltar' : 'Passo anterior'}
          className="w-9 h-9 rounded-sm bg-transparent border-0 text-goscore-fg flex items-center justify-center active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="font-display text-lg font-semibold tracking-heading leading-tight">
          Configurar
        </span>
        <span className="ml-auto text-[13px] font-medium text-goscore-muted font-mono tracking-timer" aria-live="polite">
          {step + 1}/{TOTAL_STEPS}
        </span>
      </header>

      <div className="w-full h-0.5 bg-goscore-border rounded-full mb-5 flex-shrink-0 overflow-hidden" aria-hidden="true">
        <div
          className="h-full bg-goscore-accent rounded-full origin-left transition-transform duration-300"
          style={{ transform: `scaleX(${(step + 1) / TOTAL_STEPS})` }}
        />
      </div>

      <div
        className={`flex-1 flex flex-col min-h-0 ${
          isLandscape ? 'gap-2 overflow-y-auto' : 'gap-3.5'
        }`}
        aria-live="polite"
      >
        {step < 2 && (
          <TeamStepCard
            team={teams[step]}
            idx={step}
            updateTeam={updateTeam}
            isLandscape={isLandscape}
          />
        )}

        {step === 2 && (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div
                className="flex items-center justify-between py-3.5 border-t border-goscore-border"
                data-od-id="swipe-toggle"
              >
                <div>
                  <span className="block text-[15px] font-medium text-goscore-fg leading-snug" id="swipe-label">
                    Swipe +3
                  </span>
                  <p className="text-[13px] text-goscore-muted leading-snug mt-0.5">
                    Arrastar para cima soma 3 pontos
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSwipeUp((v) => !v)}
                  role="switch"
                  aria-checked={swipeUp}
                  aria-labelledby="swipe-label"
                  className={`relative w-11 h-[26px] rounded-full flex-shrink-0 border-0 transition-colors duration-200 ${
                    swipeUp ? 'bg-goscore-accent' : 'bg-goscore-border'
                  }`}
                >
                  <span
                    className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                      swipeUp ? 'translate-x-[18px]' : 'translate-x-0'
                    }`}
                    style={{
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.04)',
                    }}
                  />
                </button>
              </div>

              <div className="mt-6 p-4 bg-goscore-surface rounded-sm border border-goscore-border">
                <p className="text-sm text-goscore-fg-secondary leading-relaxed text-center">
                  <span className="text-lg">{teams[0].icon}</span>{' '}
                  <span className="font-semibold text-goscore-fg">{teams[0].name}</span>
                  {' '}vs{' '}
                  <span className="font-semibold text-goscore-fg">{teams[1].name}</span>
                  {' '}<span className="text-lg">{teams[1].icon}</span>
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 pt-4">
              <button
                type="button"
                onClick={() => onStart({ teams, swipeUpEnabled: swipeUp })}
                data-od-id="start-match-btn"
                aria-label="Iniciar partida"
                className="w-full h-[50px] rounded-md bg-goscore-accent text-white font-semibold text-[15px] tracking-wide flex items-center justify-center active:scale-[0.98] transition-transform"
              >
                Iniciar
              </button>
            </div>
          </div>
        )}
      </div>

      {step < 2 && (
        <nav
          className="flex items-center justify-end flex-shrink-0 border-t border-goscore-border pt-3.5"
          data-od-id="step-nav"
          aria-label="Navegacao entre passos"
        >
          <button
            type="button"
            onClick={nextStep}
            aria-label="Proximo passo"
            className="flex items-center gap-1 h-10 px-4 rounded-sm bg-goscore-fg text-goscore-bg font-semibold text-sm border-0 active:scale-95 transition-transform"
          >
            Proximo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  )
}
