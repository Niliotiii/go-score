import { useState } from 'react'
import { DEFAULT_TEAMS, DEFAULT_TARGET_SCORE, DEFAULT_TARGET_SETS } from '../lib/constants'
import { TeamStepCard } from '../components/TeamStepCard'
import { clamp } from '../lib/utils'

export function SetupScreen({ onStart, onBack, isLandscape }) {
  const [step, setStep] = useState(0)
  const [teams, setTeams] = useState(() => DEFAULT_TEAMS.map((t) => ({ ...t })))
  const [targetScore, setTargetScore] = useState(DEFAULT_TARGET_SCORE)
  const [targetSets, setTargetSets] = useState(DEFAULT_TARGET_SETS)

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
      className="flex flex-col min-h-[100dvh] bg-goscore-bg overflow-hidden"
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
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4">
              <div className="w-full p-4 bg-goscore-surface rounded-sm border border-goscore-border">
                <p className="text-sm text-goscore-fg-secondary leading-relaxed text-center">
                  <span className="text-lg">{teams[0].icon}</span>{' '}
                  <span className="font-semibold text-goscore-fg">{teams[0].name}</span>
                  {' '}vs{' '}
                  <span className="font-semibold text-goscore-fg">{teams[1].name}</span>
                  {' '}<span className="text-lg">{teams[1].icon}</span>
                </p>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-goscore-border">
                <span className="text-[15px] font-medium text-goscore-fg">Pontos por set</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetScore((v) => clamp(v - 1, 0, 99))}
                    aria-label="Diminuir pontos por set"
                    className="w-9 h-9 rounded-sm bg-goscore-surface border border-goscore-border text-goscore-fg flex items-center justify-center active:scale-95 transition-transform"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono text-[15px] font-semibold">{targetScore === 0 ? '∞' : targetScore}</span>
                  <button
                    type="button"
                    onClick={() => setTargetScore((v) => clamp(v + 1, 0, 99))}
                    aria-label="Aumentar pontos por set"
                    className="w-9 h-9 rounded-sm bg-goscore-surface border border-goscore-border text-goscore-fg flex items-center justify-center active:scale-95 transition-transform"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-goscore-border">
                <span className="text-[15px] font-medium text-goscore-fg">Sets para vencer</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetSets((v) => clamp(v - 1, 0, 5))}
                    aria-label="Diminuir sets para vencer"
                    className="w-9 h-9 rounded-sm bg-goscore-surface border border-goscore-border text-goscore-fg flex items-center justify-center active:scale-95 transition-transform"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono text-[15px] font-semibold">{targetSets === 0 ? '∞' : targetSets}</span>
                  <button
                    type="button"
                    onClick={() => setTargetSets((v) => clamp(v + 1, 0, 5))}
                    aria-label="Aumentar sets para vencer"
                    className="w-9 h-9 rounded-sm bg-goscore-surface border border-goscore-border text-goscore-fg flex items-center justify-center active:scale-95 transition-transform"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 pt-4">
              <button
                type="button"
                onClick={() => onStart({ teams, targetScore, targetSets })}
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
