import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { colors, spacing, radius } from '../theme/tokens';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const INSTRUCTIONS = [
  {
    title: 'Relógio',
    description: 'Toque no centro do tempo para iniciar ou pausar. Pressione e segure por 5 segundos para zerar.',
  },
  {
    title: 'Marcador de sets',
    description: 'Toque nos pontinhos na parte superior para adicionar 1 set. Pressione e segure para remover 1 set.',
  },
  {
    title: 'Marcador de pontos',
    description: 'Toque no placar para +1 ponto. Arraste para cima para +3 (se o Swipe +3 estiver ligado). Arraste para baixo para -1.',
  },
];

export function HelpModal({ visible, onClose }: HelpModalProps) {
  return (
    <BottomSheet visible={visible} title="Como usar" onClose={onClose}>
      <View style={styles.list}>
        {INSTRUCTIONS.map((item) => (
          <View key={item.title} style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDesc}>{item.description}</Text>
          </View>
        ))}
      </View>
      <Pressable style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeBtnText}>Fechar</Text>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.lg },
  item: {},
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.fgDark,
    marginBottom: spacing.xs,
  },
  itemDesc: {
    fontSize: 13,
    color: colors.mutedDark,
    lineHeight: 18,
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
});
