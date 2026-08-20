import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TeamStepCard } from '../components/TeamStepCard';
import { DEFAULT_TEAMS, DEFAULT_TARGET_SCORE, DEFAULT_TARGET_SETS } from '../lib/constants';
import { clamp } from '../lib/utils';
import { colors, spacing, radius, type as typeTokens } from '../theme/tokens';
import type { Team } from '../types';

interface SetupScreenProps {
  onStart: (config: { teams: [Team, Team]; targetScore: number; targetSets: number; swipeUpEnabled: boolean }) => void;
  onBack: () => void;
}

export function SetupScreen({ onStart, onBack }: SetupScreenProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [teams, setTeams] = useState<[Team, Team]>([
    { ...DEFAULT_TEAMS[0] },
    { ...DEFAULT_TEAMS[1] },
  ]);
  const [targetScore, setTargetScore] = useState(DEFAULT_TARGET_SCORE);
  const [targetSets, setTargetSets] = useState(DEFAULT_TARGET_SETS);
  const [swipeUpEnabled, setSwipeUpEnabled] = useState(true);

  const TOTAL_STEPS = 3;

  function updateTeam(idx: number, field: keyof Team, value: string) {
    setTeams((prev) => {
      const copy: [Team, Team] = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }

  function nextStep() {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  }

  function prevStep() {
    if (step > 0) setStep((s) => s - 1);
    else onBack();
  }

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + spacing.lg,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={prevStep} accessibilityLabel={step === 0 ? 'Voltar' : 'Passo anterior'}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Configurar</Text>
        <Text style={styles.stepCounter}>{step + 1}/{TOTAL_STEPS}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((step + 1) / TOTAL_STEPS) * 100}%` }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {step < 2 && (
          <TeamStepCard team={teams[step]} idx={step} updateTeam={updateTeam} />
        )}

        {step === 2 && (
          <View style={styles.finalStep}>
            <View style={styles.matchupCard}>
              <Text style={styles.matchupText}>
                {teams[0].icon} <Text style={styles.matchupName}>{teams[0].name}</Text>
                {'  vs  '}
                <Text style={styles.matchupName}>{teams[1].name}</Text> {teams[1].icon}
              </Text>
            </View>

            <Pressable
              style={styles.settingRow}
              onPress={() => setSwipeUpEnabled((v) => !v)}
              accessibilityRole="switch"
              accessibilityState={{ checked: swipeUpEnabled }}
            >
              <View>
                <Text style={styles.settingLabel}>Swipe +3</Text>
                <Text style={styles.settingHint}>Arrastar para cima soma 3 pontos</Text>
              </View>
              <View style={[styles.toggle, swipeUpEnabled && styles.toggleOn]}>
                <View style={[styles.toggleKnob, swipeUpEnabled && styles.toggleKnobOn]} />
              </View>
            </Pressable>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Pontos por set</Text>
              <View style={styles.stepper}>
                <Pressable style={styles.stepperBtn} onPress={() => setTargetScore((v) => clamp(v - 1, 0, 99))}>
                  <Text style={styles.stepperBtnText}>−</Text>
                </Pressable>
                <Text style={styles.stepperValue}>{targetScore === 0 ? '∞' : targetScore}</Text>
                <Pressable style={styles.stepperBtn} onPress={() => setTargetScore((v) => clamp(v + 1, 0, 99))}>
                  <Text style={styles.stepperBtnText}>+</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Sets para vencer</Text>
              <View style={styles.stepper}>
                <Pressable style={styles.stepperBtn} onPress={() => setTargetSets((v) => clamp(v - 1, 0, 5))}>
                  <Text style={styles.stepperBtnText}>−</Text>
                </Pressable>
                <Text style={styles.stepperValue}>{targetSets === 0 ? '∞' : targetSets}</Text>
                <Pressable style={styles.stepperBtn} onPress={() => setTargetSets((v) => clamp(v + 1, 0, 5))}>
                  <Text style={styles.stepperBtnText}>+</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.spacer} />

            <Pressable
              style={styles.startBtn}
              onPress={() => onStart({ teams, targetScore, targetSets, swipeUpEnabled })}
              accessibilityLabel="Iniciar partida"
            >
              <Text style={styles.startBtnText}>Iniciar</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Navigation */}
      {step < 2 && (
        <View style={styles.nav}>
          <Pressable style={styles.navBtnPrimary} onPress={nextStep} accessibilityLabel="Próximo passo">
            <Text style={styles.navBtnPrimaryText}>Próximo</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: colors.fg,
    marginTop: -2,
  },
  title: {
    ...typeTokens.heading,
    color: colors.fg,
  },
  stepCounter: {
    marginLeft: 'auto',
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '500',
    color: colors.muted,
  },
  progressTrack: {
    height: 2,
    backgroundColor: colors.border,
    borderRadius: 1,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 1,
  },
  content: {
    flex: 1,
  },
  finalStep: {
    flex: 1,
    gap: spacing.lg,
  },
  matchupCard: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  matchupText: {
    fontSize: 14,
    color: colors.fgSecondary,
    textAlign: 'center',
  },
  matchupName: {
    fontWeight: '600',
    color: colors.fg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.fg,
  },
  settingHint: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 6,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: colors.accent,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 18,
    color: colors.fg,
  },
  stepperValue: {
    width: 32,
    textAlign: 'center',
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: '600',
    color: colors.fg,
  },
  spacer: { flex: 1, minHeight: spacing.xl },
  startBtn: {
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'stretch',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.lg,
  },
  navBtnPrimary: {
    flex: 1,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.fg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPrimaryText: {
    color: colors.bg,
    fontSize: 15,
    fontWeight: '600',
  },
});
