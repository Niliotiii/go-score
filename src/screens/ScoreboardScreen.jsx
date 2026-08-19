import { useEffect, useRef, useState } from 'react'
import { TimerBar } from '../components/TimerBar'
import { TeamColumn } from '../components/TeamColumn'
import { ResetModal } from '../components/ResetModal'
import { ScoreboardMenu } from '../components/ScoreboardMenu'
import { HelpModal } from '../components/HelpModal'
import { VictoryModal } from '../components/VictoryModal'
import { useWakeLock } from '../hooks/useWakeLock'
import { triggerHaptic } from '../lib/utils'

export function ScoreboardScreen({ state, onUpdate, onEnd, isLandscape }) {
  const { teams, scores, sets, targetScore, targetSets, swipeUpEnabled, swapped } = state
  const [timer, setTimer] = useState(state.timer || 0)
  const [running, setRunning] = useState(state.timerRunning || false)
  const [showMenu, setShowMenu] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showVictory, setShowVictory] = useState(null)

  useWakeLock(true)

  const intervalRef = useRef(null)
  const stateRef = useRef(state)
  const onUpdateRef = useRef(onUpdate)

  useEffect(() => {
    stateRef.current = state
    onUpdateRef.current = onUpdate
  })

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimer((t) => {
          const next = t + 1
          onUpdateRef.current({ ...stateRef.current, timer: next, timerRunning: true })
          return next
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
      onUpdateRef.current({ ...stateRef.current, timer, timerRunning: false })
    }
    return () => clearInterval(intervalRef.current)
  }, [running, timer])

  function addScore(teamIdx, delta) {
    const nextScore = Math.max(0, scores[teamIdx] + delta)
    if (nextScore === scores[teamIdx]) return

    const newScores = [...scores]
    newScores[teamIdx] = nextScore

    const effectiveTarget = targetScore || 12
    if (nextScore >= effectiveTarget) {
      const newSets = [...sets]
      newSets[teamIdx] = newSets[teamIdx] + 1
      if (newSets[teamIdx] >= (targetSets || 2)) {
        onUpdate({ ...state, scores: [0, 0], sets: newSets })
        setShowVictory(teams[teamIdx])
        triggerHaptic([50, 100, 50])
        return
      }
      onUpdate({ ...state, scores: [0, 0], sets: newSets })
      triggerHaptic([30, 60, 30])
      return
    }

    onUpdate({ ...state, scores: newScores })
  }

  function changeSet(teamIdx, delta) {
    const newSets = [...sets]
    newSets[teamIdx] = Math.min(5, Math.max(0, newSets[teamIdx] + delta))
    onUpdate({ ...state, sets: newSets })
    triggerHaptic(20)
  }

  function swapSides() {
    onUpdate({ ...state, swapped: !swapped })
  }

  function resetAll() {
    setTimer(0)
    setRunning(false)
    onUpdate({ ...state, scores: [0, 0], sets: [0, 0], timer: 0, timerRunning: false })
  }

  function rematch() {
    setTimer(0)
    setRunning(false)
    setShowVictory(null)
    onUpdate({
      ...state,
      scores: [0, 0],
      sets: [0, 0],
      timer: 0,
      timerRunning: false,
      swapped: !state.swapped,
    })
  }

  function toggleSwipeUp() {
    onUpdate({ ...state, swipeUpEnabled: !swipeUpEnabled })
  }

  const order = swapped ? [1, 0] : [0, 1]

  return (
    <main
      className="flex flex-col min-h-[100dvh] bg-goscore-bg-dark text-goscore-fg-dark"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      data-od-id="scoreboard-screen"
      aria-label="Placar da partida"
    >
      <div className="fixed inset-0 bg-goscore-bg-dark -z-10" aria-hidden="true" />

      <TimerBar
        timer={timer}
        running={running}
        onToggle={() => setRunning((r) => !r)}
        onReset={() => {
          setTimer(0)
          setRunning(false)
        }}
        isLandscape={isLandscape}
        leftAction={
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            aria-label="Como usar"
            className="w-full h-full flex items-center justify-center rounded-sm bg-transparent text-goscore-fg-dark border-0 active:scale-95 transition-transform"
            data-od-id="help-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
        }
      >
        <button
          type="button"
          onClick={() => setShowMenu(true)}
          aria-label="Abrir menu de opcoes"
          className="w-full h-full flex items-center justify-center rounded-sm bg-transparent text-goscore-fg-dark border-0 active:scale-95 transition-transform"
          data-od-id="scoreboard-menu-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </TimerBar>

      <div className={`flex flex-1 overflow-hidden ${isLandscape ? 'flex-row' : 'flex-col'}`}>
        <TeamColumn
          team={teams[order[0]]}
          score={scores[order[0]]}
          setsWon={sets[order[0]]}
          swipeUpEnabled={swipeUpEnabled}
          onScore={(delta) => addScore(order[0], delta)}
          onSetChange={(delta) => changeSet(order[0], delta)}
          isLandscape={isLandscape}
        />
        <div className={`bg-white/5 self-stretch ${isLandscape ? 'w-px' : 'h-px'}`} aria-hidden="true" />
        <TeamColumn
          team={teams[order[1]]}
          score={scores[order[1]]}
          setsWon={sets[order[1]]}
          swipeUpEnabled={swipeUpEnabled}
          onScore={(delta) => addScore(order[1], delta)}
          onSetChange={(delta) => changeSet(order[1], delta)}
          isLandscape={isLandscape}
        />
      </div>

      {showMenu && (
        <ScoreboardMenu
          swipeUpEnabled={swipeUpEnabled}
          onToggleSwipeUp={() => {
            toggleSwipeUp()
            setShowMenu(false)
          }}
          onSwapSides={() => {
            swapSides()
            setShowMenu(false)
          }}
          onReset={() => {
            setShowMenu(false)
            setShowResetConfirm(true)
          }}
          onExit={() => {
            onEnd()
            setShowMenu(false)
          }}
          onClose={() => setShowMenu(false)}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showResetConfirm && (
        <ResetModal onCancel={() => setShowResetConfirm(false)} onConfirm={() => { resetAll(); setShowResetConfirm(false) }} />
      )}

      {showVictory && (
        <VictoryModal
          team={showVictory}
          onRematch={rematch}
          onExit={() => {
            setShowVictory(null)
            onEnd()
          }}
        />
      )}
    </main>
  )
}
