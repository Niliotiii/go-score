import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { formatTime, triggerHaptic } from '../lib/utils';
import { useLongPress } from '../hooks/useLongPress';
import { colors, spacing, type } from '../theme/tokens';

interface TimerBarProps {
  timer: number;
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export function TimerBar({ timer, running, onToggle, onReset, leftAction, rightAction }: TimerBarProps) {
  const [progress, setProgress] = useState(0);

  const handleProgress = useCallback((pct: number) => {
    setProgress(pct);
  }, []);

  const pressHandlers = useLongPress({
    onShortPress: () => {
      triggerHaptic('light');
      onToggle();
    },
    onLongPress: () => {
      triggerHaptic('heavy');
      onReset();
    },
    duration: 5000,
    onProgress: handleProgress,
  });

  return (
    <View style={styles.container}>
      {leftAction ? (
        <View style={styles.actionSlot}>{leftAction}</View>
      ) : (
        <View style={styles.actionSlot} />
      )}

      <View style={styles.timerArea} {...pressHandlers}>
        <Text
          style={[styles.timerText, !running && styles.timerTextPaused]}
          accessibilityRole="timer"
          accessibilityLabel={`Cronômetro: ${formatTime(timer)}. ${running ? 'Em andamento' : 'Pausado'}.`}
        >
          {formatTime(timer)}
        </Text>
        {running && <View style={styles.dot} />}
      </View>

      {rightAction ? (
        <View style={styles.actionSlot}>{rightAction}</View>
      ) : (
        <View style={styles.actionSlot} />
      )}

      {progress > 0 && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
    paddingHorizontal: spacing.lg,
    position: 'relative',
  },
  actionSlot: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    cursor: 'pointer' as any,
  },
  timerText: {
    fontFamily: 'monospace',
    fontSize: type.timer.fontSize,
    fontWeight: type.timer.fontWeight,
    letterSpacing: type.timer.letterSpacing,
    color: colors.fgDark,
    fontVariant: ['tabular-nums'],
  },
  timerTextPaused: {
    color: colors.mutedDark,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginLeft: spacing.sm,
  },
  progressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.danger,
  },
});
