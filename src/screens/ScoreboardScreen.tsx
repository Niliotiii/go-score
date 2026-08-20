import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TimerBar } from '../components/TimerBar';
import { TeamColumn } from '../components/TeamColumn';
import { BottomSheet } from '../components/BottomSheet';
import { HelpModal } from '../components/HelpModal';
import { useWakeLock } from '../hooks/useWakeLock';
import { triggerHaptic } from '../lib/utils';
import { playClickSound } from '../lib/audio';
import { colors, spacing, radius } from '../theme/tokens';
import type { MatchState, Team } from '../types';

interface ScoreboardScreenProps {
  state: MatchState;
  onUpdate: (state: MatchState) => void;
  onEnd: () => void;
}

export function ScoreboardScreen({ state, onUpdate, onEnd }: ScoreboardScreenProps) {
  const { teams, scores, sets, targetScore, targetSets, swipeUpEnabled, deuceEnabled, swapped } = state;
  const insets = useSafeAreaInsets();
  const [timer, setTimer] = useState(state.timer || 0);
  const [running, setRunning] = useState(state.timerRunning || false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showVictory, setShowVictory] = useState<Team | null>(null);

  useWakeLock(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    stateRef.current = state;
    onUpdateRef.current = onUpdate;
  });

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimer((t) => {
          const next = t + 1;
          onUpdateRef.current({ ...stateRef.current, timer: next, timerRunning: true });
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  function addScore(teamIdx: number, delta: number) {
    const nextScore = Math.max(0, scores[teamIdx] + delta);
    if (nextScore === scores[teamIdx]) return;

    const newScores: [number, number] = [...scores];
    newScores[teamIdx] = nextScore;

    playClickSound('point');

    if (targetScore > 0) {
      const otherIdx = teamIdx === 0 ? 1 : 0;
      const deuceThreshold = targetScore - 1;
      const isDeuce = deuceEnabled && scores[otherIdx] >= deuceThreshold && scores[teamIdx] >= deuceThreshold;

      // No modo "Vai a 3": a partir do empate no threshold, precisa chegar a threshold + 3
      const effectiveTarget = isDeuce ? deuceThreshold + 3 : targetScore;

      if (nextScore >= effectiveTarget) {
        const newSets: [number, number] = [...sets];
        newSets[teamIdx] = newSets[teamIdx] + 1;
        playClickSound('set');

        if (targetSets > 0 && newSets[teamIdx] >= targetSets) {
          onUpdate({ ...state, scores: [0, 0], sets: newSets });
          setShowVictory(teams[teamIdx]);
          triggerHaptic('heavy');
          playClickSound('win');
          return;
        }
        onUpdate({ ...state, scores: [0, 0], sets: newSets });
        triggerHaptic('medium');
        return;
      }
    }

    onUpdate({ ...state, scores: newScores });
  }

  function changeSet(teamIdx: number, delta: number) {
    const newSets: [number, number] = [...sets];
    newSets[teamIdx] = Math.min(5, Math.max(0, newSets[teamIdx] + delta));
    onUpdate({ ...state, sets: newSets });
    triggerHaptic('light');
    playClickSound('set');
  }

  function swapSides() {
    onUpdate({ ...state, swapped: !swapped });
  }

  function resetAll() {
    setTimer(0);
    setRunning(false);
    onUpdate({ ...state, scores: [0, 0], sets: [0, 0], timer: 0, timerRunning: false });
  }

  function rematch() {
    setTimer(0);
    setRunning(false);
    setShowVictory(null);
    onUpdate({
      ...state,
      scores: [0, 0],
      sets: [0, 0],
      timer: 0,
      timerRunning: false,
      swapped: !state.swapped,
    });
  }

  function toggleSwipeUp() {
    onUpdate({ ...state, swipeUpEnabled: !swipeUpEnabled });
  }

  const order: [number, number] = swapped ? [1, 0] : [0, 1];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <TimerBar
        timer={timer}
        running={running}
        onToggle={() => setRunning((r) => !r)}
        onReset={() => { setTimer(0); setRunning(false); }}
        leftAction={
          <Pressable
            onPress={() => setShowHelp(true)}
            accessibilityLabel="Como usar"
            style={styles.headerBtn}
          >
            <Text style={styles.headerBtnIcon}>?</Text>
          </Pressable>
        }
        rightAction={
          <Pressable
            onPress={() => setShowMenu(true)}
            accessibilityLabel="Abrir menu de opções"
            style={styles.headerBtn}
          >
            <Text style={styles.headerBtnIcon}>☰</Text>
          </Pressable>
        }
      />

      <View style={styles.columns}>
        <TeamColumn
          team={teams[order[0]]}
          score={scores[order[0]]}
          setsWon={sets[order[0]]}
          swipeUpEnabled={swipeUpEnabled}
          targetScore={targetScore}
          deuceEnabled={deuceEnabled}
          opponentScore={scores[order[1]]}
          onScore={(delta) => addScore(order[0], delta)}
          onSetChange={(delta) => changeSet(order[0], delta)}
        />
        <View style={styles.divider} />
        <TeamColumn
          team={teams[order[1]]}
          score={scores[order[1]]}
          setsWon={sets[order[1]]}
          swipeUpEnabled={swipeUpEnabled}
          targetScore={targetScore}
          deuceEnabled={deuceEnabled}
          opponentScore={scores[order[0]]}
          onScore={(delta) => addScore(order[1], delta)}
          onSetChange={(delta) => changeSet(order[1], delta)}
        />
      </View>

      {/* Help Modal */}
      <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} />

      {/* Menu sheet */}
      <BottomSheet visible={showMenu} title="Opções" onClose={() => setShowMenu(false)}>
        <View style={styles.menuItems}>
          <Pressable
            style={styles.menuItem}
            onPress={() => { toggleSwipeUp(); setShowMenu(false); }}
          >
            <Text style={styles.menuItemText}>Swipe +3</Text>
            <View style={[styles.toggle, swipeUpEnabled && styles.toggleOn]}>
              <View style={[styles.toggleKnob, swipeUpEnabled && styles.toggleKnobOn]} />
            </View>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => { swapSides(); setShowMenu(false); }}
          >
            <Text style={styles.menuItemText}>⇄ Inverter lados</Text>
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.menuItemDanger]}
            onPress={() => { setShowMenu(false); setShowReset(true); }}
          >
            <Text style={[styles.menuItemText, styles.menuItemDangerText]}>↺ Zerar placar</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => { setShowMenu(false); onEnd(); }}
          >
            <Text style={styles.menuItemText}>⎋ Sair da partida</Text>
          </Pressable>
        </View>

        <Pressable style={styles.closeBtn} onPress={() => setShowMenu(false)}>
          <Text style={styles.closeBtnText}>Fechar</Text>
        </Pressable>
      </BottomSheet>

      {/* Reset confirm */}
      <BottomSheet visible={showReset} title="Zerar tudo?" onClose={() => setShowReset(false)}>
        <Text style={styles.modalDesc}>Pontos e sets voltam a zero. Não pode ser desfeito.</Text>
        <View style={styles.modalActions}>
          <Pressable style={styles.modalCancel} onPress={() => setShowReset(false)}>
            <Text style={styles.modalCancelText}>Cancelar</Text>
          </Pressable>
          <Pressable style={styles.modalConfirmDanger} onPress={() => { resetAll(); setShowReset(false); }}>
            <Text style={styles.modalConfirmText}>Zerar</Text>
          </Pressable>
        </View>
      </BottomSheet>

      {/* Victory */}
      <BottomSheet visible={!!showVictory} title="" onClose={() => {}}>
        <View style={styles.victoryContent}>
          <Text style={styles.victoryIcon}>{showVictory?.icon}</Text>
          <Text style={styles.victoryTitle}>{showVictory?.name} venceu!</Text>
          <Text style={styles.victorySubtitle}>Fim da partida</Text>
        </View>
        <View style={styles.modalActions}>
          <Pressable style={styles.modalCancel} onPress={() => { setShowVictory(null); onEnd(); }}>
            <Text style={styles.modalCancelText}>Sair</Text>
          </Pressable>
          <Pressable style={styles.modalConfirm} onPress={rematch}>
            <Text style={styles.modalConfirmText}>Revanche</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnIcon: {
    fontSize: 18,
    color: colors.fgDark,
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  footerBtn: {
    height: 36,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  menuItems: { gap: spacing.sm + 2 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  menuItemDanger: {
    borderColor: 'rgba(214,40,57,0.2)',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.fgDark,
  },
  menuItemDangerText: {
    color: colors.danger,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.borderDark,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: colors.accent,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  closeBtn: {
    height: 44,
    marginTop: spacing.xl,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.fgDark,
  },
  modalDesc: {
    fontSize: 14,
    color: colors.mutedDark,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  modalCancel: {
    flex: 1,
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.fgDark,
  },
  modalConfirm: {
    flex: 1,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmDanger: {
    flex: 1,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  victoryContent: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  victoryIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  victoryTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: colors.fgDark,
    marginBottom: spacing.xs,
  },
  victorySubtitle: {
    fontSize: 13,
    color: colors.mutedDark,
  },
});
