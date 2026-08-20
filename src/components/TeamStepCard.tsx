import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { PRESET_COLORS, TEAM_ICONS } from '../lib/constants';
import { colors, spacing, radius, type } from '../theme/tokens';
import type { Team } from '../types';

interface TeamStepCardProps {
  team: Team;
  idx: number;
  updateTeam: (idx: number, field: keyof Team, value: string) => void;
}

export function TeamStepCard({ team, idx, updateTeam }: TeamStepCardProps) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.label}>Nome do time</Text>
        <TextInput
          style={styles.input}
          value={team.name}
          onChangeText={(text) => updateTeam(idx, 'name', text)}
          placeholder="Ex: Falcões"
          placeholderTextColor={colors.muted}
          maxLength={16}
          autoComplete="off"
        />
      </View>

      <View>
        <Text style={styles.label}>Cor</Text>
        <View style={styles.colorGrid}>
          {PRESET_COLORS.map((c) => {
            const active = team.color === c;
            return (
              <Pressable
                key={c}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c },
                  active && styles.colorSwatchActive,
                  active && { borderColor: colors.fg },
                ]}
                onPress={() => updateTeam(idx, 'color', c)}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                accessibilityLabel={`Cor ${c}`}
              />
            );
          })}
        </View>
      </View>

      <View>
        <Text style={styles.label}>Ícone</Text>
        <View style={styles.iconGrid}>
          {TEAM_ICONS.map((icon) => {
            const active = team.icon === icon;
            return (
              <Pressable
                key={icon}
                style={[styles.iconCell, active && styles.iconCellActive]}
                onPress={() => updateTeam(idx, 'icon', icon)}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                accessibilityLabel={`Ícone ${icon}`}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { gap: spacing.lg, paddingBottom: spacing.xl },
  label: {
    ...type.label,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  input: {
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    color: colors.fg,
    backgroundColor: colors.surface,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm + 2,
    padding: spacing.xs,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchActive: {
    borderWidth: 2.5,
    transform: [{ scale: 1.15 }],
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm - 2,
  },
  iconCell: {
    width: 40,
    height: 40,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  iconCellActive: {
    backgroundColor: colors.accent + '1F',
    borderColor: colors.accent,
  },
  iconText: {
    fontSize: 18,
  },
});
