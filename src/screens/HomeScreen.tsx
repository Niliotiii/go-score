import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '../components/Logo';
import { colors, spacing, radius } from '../theme/tokens';

interface HomeScreenProps {
  hasSaved: boolean;
  onNew: () => void;
  onResume: () => void;
}

export function HomeScreen({ hasSaved, onNew, onResume }: HomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          flexGrow: 1,
          paddingTop: spacing.xl + insets.top,
          paddingBottom: spacing.xxl + insets.bottom,
        },
      ]}
    >
      <Logo />

      <Text style={styles.subtitle}>
        Marcador de pontos para partidas casuais. Sem cadastro, sem conexão.
      </Text>

      <View style={styles.spacer} />

      <Pressable
        style={styles.ctaPrimary}
        onPress={onNew}
        accessibilityLabel="Iniciar nova partida"
      >
        <Text style={styles.ctaPrimaryText}>Nova Partida</Text>
      </Pressable>

      {hasSaved && (
        <Pressable
          style={styles.ctaSecondary}
          onPress={onResume}
          accessibilityLabel="Continuar partida salva"
        >
          <Text style={styles.ctaSecondaryText}>Continuar</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl },
  subtitle: {
    fontSize: 15,
    color: colors.fgSecondary,
    lineHeight: 22,
    marginTop: spacing.sm + 2,
    maxWidth: 280,
  },
  spacer: { flex: 1, minHeight: spacing.xl },
  ctaPrimary: {
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.fg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  ctaPrimaryText: {
    color: colors.bg,
    fontSize: 15,
    fontWeight: '600',
  },
  ctaSecondary: {
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm + 2,
    minHeight: 44,
  },
  ctaSecondaryText: {
    color: colors.fg,
    fontSize: 15,
    fontWeight: '500',
  },
});
