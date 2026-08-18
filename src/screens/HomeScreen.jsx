import { Logo } from '../components/Logo'
import { InstallPrompt } from '../components/InstallBanner'

export function HomeScreen({ onNew, onResume, hasSaved, isLandscape }) {
  return (
    <main
      className={`flex min-h-[100dvh] bg-goscore-bg ${
        isLandscape
          ? 'flex-row items-center justify-center gap-8 px-7'
          : 'flex-col px-7'
      }`}
      style={{
        paddingTop: isLandscape
          ? 'calc(env(safe-area-inset-top, 0px) + 16px)'
          : 'calc(env(safe-area-inset-top, 0px) + 40px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)',
      }}
      data-od-id="home-screen"
      aria-label="GoScore - tela inicial"
    >
      <div
        className={`flex flex-col gap-2.5 ${
          isLandscape ? 'flex-1 max-w-[280px] pt-0' : 'pt-12'
        }`}
      >
        <Logo />
        <p className="text-[15px] text-goscore-fg-secondary leading-relaxed max-w-[260px]">
          Marcador de pontos para partidas casuais. Sem cadastro, sem conexao.
        </p>
      </div>

      <div
        className={`flex flex-col justify-end gap-2.5 ${
          isLandscape ? 'w-[200px] flex-shrink-0' : 'mt-auto'
        } ${hasSaved ? 'h-[90px]' : 'h-10'}`}
      >
        <button
          type="button"
          onClick={onNew}
          data-od-id="new-match-btn"
          aria-label="Iniciar nova partida"
          className="w-full h-10 rounded-md bg-goscore-fg text-goscore-bg font-semibold text-[15px] tracking-wide flex items-center justify-center active:scale-[0.98] transition-transform"
        >
          Nova Partida
        </button>
        {hasSaved && (
          <button
            type="button"
            onClick={onResume}
            data-od-id="resume-btn"
            aria-label="Continuar partida salva"
            className="w-full h-10 rounded-md bg-transparent text-goscore-fg font-medium text-[15px] tracking-wide border border-goscore-border flex items-center justify-center active:scale-[0.98] transition-transform"
          >
            Continuar
          </button>
        )}
      </div>

      <InstallPrompt />
    </main>
  )
}
