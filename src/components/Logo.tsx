import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, type } from '../theme/tokens';

interface LogoProps {
  dark?: boolean;
  size?: number;
  showWordmark?: boolean;
}

export function Logo({ dark = false, size = 36, showWordmark = true }: LogoProps) {
  const fg = dark ? colors.fgDark : colors.fg;

  return (
    <View style={styles.row}>
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <Path d="M5 3h22l-2 22-9 4-9-4-2-22z" fill={fg} />
        <Path
          d="M11.5 23l4.5-14"
          stroke={colors.accent}
          strokeWidth={3}
          strokeLinecap="square"
        />
        <Path
          d="M16.5 23l4.5-14"
          stroke={colors.accent}
          strokeWidth={3}
          strokeLinecap="square"
        />
      </Svg>
      {showWordmark && (
        <Text style={[styles.wordmark, { color: fg }]}>
          Go<Text style={styles.accentText}>Score</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  wordmark: {
    ...type.logo,
  },
  accentText: {
    color: colors.accent,
  },
});
