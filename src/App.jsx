import { useEffect, useState } from 'react'
import { DEFAULT_TEAMS, DEFAULT_TARGET_SCORE, DEFAULT_TARGET_SETS, STORAGE_KEY } from './lib/constants'
import { loadState, saveState, clearState } from './hooks/useLocalStorage'
import { useLandscape } from './hooks/useLandscape'
import { HomeScreen } from './screens/HomeScreen'
import { SetupScreen } from './screens/SetupScreen'
import { ScoreboardScreen } from './screens/ScoreboardScreen'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [matchState, setMatchState] = useState(null)
  const [hasSaved, setHasSaved] = useState(false)
  const isLandscape = useLandscape()

  useEffect(() => {
    setHasSaved(!!loadState(STORAGE_KEY))
  }, [])

  function navigateTo(target) {
    setScreen(target)
  }

  function startNewMatch() {
    navigateTo('setup')
  }

  function startMatchFromSetup({ teams, targetScore, targetSets }) {
    const state = {
      teams,
      scores: [0, 0],
      sets: [0, 0],
      targetScore,
      targetSets,
      swipeUpEnabled: true,
      timer: 0,
      timerRunning: false,
      swapped: false,
    }
    setMatchState(state)
    saveState(STORAGE_KEY, state)
    setHasSaved(true)
    navigateTo('scoreboard')
  }

  function resumeMatch() {
    const saved = loadState(STORAGE_KEY)
    if (saved) {
      setMatchState(saved)
      navigateTo('scoreboard')
    }
  }

  function updateMatch(newState) {
    setMatchState(newState)
    saveState(STORAGE_KEY, newState)
  }

  function endMatch() {
    clearState(STORAGE_KEY)
    setMatchState(null)
    setHasSaved(false)
    navigateTo('home')
  }

  return (
    <div className="h-full w-full">
      {screen === 'home' && (
        <HomeScreen
          onNew={startNewMatch}
          onResume={resumeMatch}
          hasSaved={hasSaved}
          isLandscape={isLandscape}
        />
      )}
      {screen === 'setup' && (
        <SetupScreen
          onStart={startMatchFromSetup}
          onBack={() => navigateTo('home')}
          isLandscape={isLandscape}
        />
      )}
      {screen === 'scoreboard' && matchState && (
        <ScoreboardScreen
          state={matchState}
          onUpdate={updateMatch}
          onEnd={endMatch}
          isLandscape={isLandscape}
        />
      )}
    </div>
  )
}
