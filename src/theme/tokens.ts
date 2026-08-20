export const colors = {
  bg: '#F8F9FA',
  surface: '#FFFFFF',
  fg: '#1A1B1F',
  fgSecondary: '#4A4D57',
  muted: '#7A7D87',
  border: '#DDDFE4',
  accent: '#40B85C',
  danger: '#D62839',

  // Scoreboard dark mode
  bgDark: '#141418',
  surfaceDark: '#1E1F24',
  fgDark: '#F5F5F6',
  mutedDark: '#7A7D87',
  borderDark: '#2E3038',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
};

export const type = {
  logo: { fontSize: 34, fontWeight: '700' as const, letterSpacing: -1 },
  score: { fontWeight: '700' as const, letterSpacing: -1.5 },
  heading: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.3 },
  body: { fontSize: 15, lineHeight: 22 },
  label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.7, textTransform: 'uppercase' as const },
  timer: { fontSize: 18, fontWeight: '600' as const, letterSpacing: 0.4 },
  small: { fontSize: 13, color: '#7A7D87' },
};

export const motion = {
  fast: 80,
  medium: 200,
  slow: 350,
};
