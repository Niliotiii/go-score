import { Logo } from '../components/Logo'
import { InstallPrompt } from '../components/InstallBanner'

export function HomeScreen({ onNew, onResume, hasSaved, isLandscape }) {
  return (
    <main
      className="flex min-h-[100dvh] bg-goscore-bg items-center justify-center"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      data-od-id="home-screen"
      aria-label="GoScore - tela inicial"
    >
      <div
        className={`flex w-full max-w-md px-7 ${
          isLandscape
            ? 'flex-row items-center justify-center gap-8'
            : 'flex-col items-start justify-between min-h-[100dvh] py-20'
        } md:flex-col md:items-center md:justify-center md:min-h-0 md:gap-10 md:py-16`}
      >
        <div
          className={`flex flex-col gap-2.5 ${
            isLandscape ? 'flex-1 max-w-[280px]' : ''
          } md:items-center md:text-center`}
        >
          <Logo />
          <p className="text-[15px] text-goscore-fg-secondary leading-relaxed max-w-[260px] md:max-w-[320px] md:text-center">
            Marcador de pontos para partidas casuais. Sem cadastro, sem conexao.
          </p>
        </div>

        <div
          className={`flex flex-col gap-2.5 ${
            isLandscape ? 'w-[200px] flex-shrink-0' : 'mt-auto w-full'
          } md:mt-0 md:w-full md:max-w-[320px]`}
        >
          <button
            type="button"
            onClick={onNew}
            data-od-id="new-match-btn"
            aria-label="Iniciar nova partida"
            className="w-full h-[50px] rounded-md bg-goscore-fg text-goscore-bg font-semibold text-[15px] tracking-wide flex items-center justify-center active:scale-[0.98] transition-transform"
          >
            Nova Partida
          </button>
          {hasSaved && (
            <button
              type="button"
              onClick={onResume}
              data-od-id="resume-btn"
              aria-label="Continuar partida salva"
              className="w-full h-[50px] rounded-md bg-transparent text-goscore-fg font-medium text-[15px] tracking-wide border-[1.5px] border-goscore-border flex items-center justify-center active:scale-[0.98] transition-transform"
            >
              Continuar
            </button>
          )}
        </div>
      </div>

      <InstallPrompt />
    </main>
  )
}
