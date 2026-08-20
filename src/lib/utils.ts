import { Platform } from 'react-native';

export function formatTime(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export async function triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (Platform.OS === 'web') {
    if (navigator.vibrate) {
      const ms = style === 'light' ? 10 : style === 'medium' ? 20 : 40;
      navigator.vibrate(ms);
    }
    return;
  }
  try {
    const Haptics = require('expo-haptics');
    const map = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    };
    await Haptics.impactAsync(map[style]);
  } catch {}
}
