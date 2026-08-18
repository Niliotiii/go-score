# GoScore

Marcador de pontos leve, rápido e mobile-first para jogos e competições casuais. Desenvolvido com **React + Vite + Tailwind CSS**, 100% frontend e offline (persistência via `localStorage`).

## Funcionalidades

- **Home**: identidade visual GoScore e acesso rápido a nova partida ou continuação.
- **Configuração**: wizard de 3 passos para personalizar nome, cor e ícone de cada time e ativar/desativar o gesto **swipe up +3**.
- **Placar**:
  - Layout lado a lado otimizado para retrato e paisagem.
  - Toque rápido: `+1 ponto`.
  - Arrastar para cima: `+3 pontos` (se habilitado).
  - Arrastar para baixo: `-1 ponto`.
  - Cronômetro integrado com play/pause (toque curto) e reset (toque longo de 5s).
  - Indicadores de sets, inversão de lados, zerar placar (com confirmação) e sair da partida.
- **Persistência**: estado da partida atual salvo automaticamente no `localStorage`.

## Scripts

```bash
npm install   # instalar dependências
npm run dev   # servidor de desenvolvimento
npm run build # build de produção
npm run lint  # oxlint
npm run preview # preview do build
```

## Estrutura

```
src/
├── components/    # Logo, TeamColumn, TeamStepCard, TimerBar, ResetModal
├── screens/       # HomeScreen, SetupScreen, ScoreboardScreen
├── hooks/         # useLandscape, useSwipe, useLongPress, useLocalStorage
├── lib/           # constants, utils
├── App.jsx        # roteador entre telas
└── main.jsx       # entry point
```

## Design

Tokens extraídos do `brand-spec.md` e do protótipo: paleta OKLCh, tipografia system-ui, logo **Slash Shield**, touch targets mínimos de 44px e foco em mobile-first sem scroll horizontal.
