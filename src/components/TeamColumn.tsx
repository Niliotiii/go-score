import { useRef, useCallback } from 'react';
import { View, Text, Animated, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useSwipe } from '../hooks/useSwipe';
import { triggerHaptic } from '../lib/utils';
import { playClickSound } from '../lib/audio';
import { colors, spacing, type } from '../theme/tokens';
import type { Team } from '../types';

interface TeamColumnProps {
  team: Team;
  score: number;
  setsWon: number;
  swipeUpEnabled: boolean;
  onScore: (delta: number) => void;
  onSetChange: (delta: number) => void;
}

export function TeamColumn({
  team,
  score,
  setsWon,
  swipeUpEnabled,
  onScore,
  onSetChange,
}: TeamColumnProps) {
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const scoreScale = useRef(new Animated.Value(1)).current;
  const flashPositive = useRef(true);

  const triggerFeedback = useCallback((positive: boolean) => {
    flashPositive.current = positive;
    flashOpacity.setValue(positive ? 0.5 : 0.4);
    Animated.timing(flashOpacity, {
      toValue: 0,
      duration: 320,
      useNativeDriver: false,
    }).start();

    scoreScale.setValue(1.12);
    Animated.spring(scoreScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: false,
    }).start();
  }, [flashOpacity, scoreScale]);

  const handleScore = useCallback((delta: number) => {
    if (delta === 3 && !swipeUpEnabled) return;
    if (delta === -1 && score === 0) return;
    onScore(delta);
    triggerFeedback(delta > 0);
    triggerHaptic(delta > 0 ? 'light' : 'medium');
    playClickSound('point');
  }, [swipeUpEnabled, score, onScore, triggerFeedback]);

  const swipeHandlers = useSwipe({
    onTap: () => handleScore(1),
    onSwipeUp: () => handleScore(3),
    onSwipeDown: () => handleScore(-1),
  });

  const setTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setPressStartRef = useRef(0);

  const handleSetPressIn = () => {
    setPressStartRef.current = Date.now();
    setTimerRef.current = setTimeout(() => {
      onSetChange(-1);
      triggerHaptic('medium');
      playClickSound('set');
      setTimerRef.current = null;
    }, 600);
  };

  const handleSetPressOut = () => {
    if (setTimerRef.current) {
      clearTimeout(setTimerRef.current);
      setTimerRef.current = null;
      const elapsed = Date.now() - setPressStartRef.current;
      if (elapsed < 600) {
        onSetChange(1);
        triggerHaptic('light');
        playClickSound('set');
      }
    }
  };

  // Mix color with dark background at 50%
  const bgColor = team.color + '80'; // hex alpha 50%

  return (
    <View
      style={[styles.container, { backgroundColor: bgColor }]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${team.name}: ${score} pontos. Toque +1${swipeUpEnabled ? ', arraste cima +3' : ''}, arraste baixo -1`}
    >
      {/* Flash overlay */}
      <Animated.View
        style={[
          styles.flash,
          {
            opacity: flashOpacity,
            backgroundColor: flashPositive.current ? 'rgba(255,255,255,0.15)' : 'rgba(214,40,57,0.2)',
            pointerEvents: 'none' as any,
          },
        ]}
      />

      {/* Sets dots - fora do responder de swipe */}
      <Pressable
        style={styles.setsRow}
        onPressIn={handleSetPressIn}
        onPressOut={handleSetPressOut}
        accessibilityLabel={`${setsWon} sets. Toque adiciona 1, segure remove 1`}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[styles.setDot, i < setsWon ? styles.setDotWon : styles.setDotEmpty]}
          />
        ))}
      </Pressable>

      {/* Swipe zone - o resto da coluna */}
      <View style={styles.swipeZone} {...swipeHandlers}>
        <Text style={styles.icon}>{team.icon}</Text>
        <Text style={styles.name}>{team.name}</Text>

        <Animated.Text
          style={[
            styles.score,
            {
              transform: [{ scale: scoreScale }],
              fontSize: Math.min(Dimensions.get('window').width * 0.18, 160),
            },
            score === 0 && styles.scoreZero,
          ]}
          accessibilityLiveRegion="polite"
        >
          {score}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  setsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    minHeight: 44,
  },
  swipeZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  setDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  setDotWon: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  setDotEmpty: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  icon: {
    fontSize: 22,
    marginBottom: spacing.xs,
    opacity: 0.9,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.xs,
  },
  score: {
    fontFamily: 'monospace',
    ...type.score,
    color: colors.fgDark,
    fontVariant: ['tabular-nums'],
  },
  scoreZero: {
    opacity: 0.45,
  },
});
