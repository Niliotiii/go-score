import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import { ScoreboardScreen } from './src/screens/ScoreboardScreen';
import { loadState, saveState, clearState } from './src/lib/storage';
import { registerServiceWorker } from './src/lib/pwa';
import { STORAGE_KEY } from './src/lib/constants';
import type { MatchState, Team } from './src/types';

type Screen = 'home' | 'setup' | 'scoreboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    registerServiceWorker();
    loadState<MatchState>(STORAGE_KEY).then((saved) => {
      if (saved) setHasSaved(true);
    });
  }, []);

  const startMatch = useCallback((config: { teams: [Team, Team]; targetScore: number; targetSets: number; swipeUpEnabled: boolean; deuceEnabled: boolean }) => {
    const state: MatchState = {
      teams: config.teams,
      scores: [0, 0],
      sets: [0, 0],
      targetScore: config.targetScore,
      targetSets: config.targetSets,
      swipeUpEnabled: config.swipeUpEnabled,
      deuceEnabled: config.deuceEnabled,
      timer: 0,
      timerRunning: false,
      swapped: false,
    };
    setMatchState(state);
    saveState(STORAGE_KEY, state);
    setHasSaved(true);
    setScreen('scoreboard');
  }, []);

  const resumeMatch = useCallback(async () => {
    const saved = await loadState<MatchState>(STORAGE_KEY);
    if (saved) {
      setMatchState(saved);
      setScreen('scoreboard');
    }
  }, []);

  const updateMatch = useCallback((newState: MatchState) => {
    setMatchState(newState);
    saveState(STORAGE_KEY, newState);
  }, []);

  const endMatch = useCallback(() => {
    clearState(STORAGE_KEY);
    setMatchState(null);
    setHasSaved(false);
    setScreen('home');
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      {screen === 'home' && (
        <HomeScreen
          hasSaved={hasSaved}
          onNew={() => setScreen('setup')}
          onResume={resumeMatch}
        />
      )}
      {screen === 'setup' && (
        <SetupScreen
          onStart={startMatch}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'scoreboard' && matchState && (
        <ScoreboardScreen
          state={matchState}
          onUpdate={updateMatch}
          onEnd={endMatch}
        />
      )}
    </SafeAreaProvider>
  );
}
