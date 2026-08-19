export const STORAGE_KEY = 'goscore_match_state'

export const DEFAULT_TARGET_SCORE = 12
export const DEFAULT_TARGET_SETS = 2

export const TEAM_ICONS = [
  '⚽', '🏀', '🏐', '🏈', '🎾', '🏓', '🏸', '⚾',
  '🥊', '🏒', '🎯', '🏆', '⭐', '🔥', '💪', '🦁'
]

export const PRESET_COLORS = [
  '#FF2D55', // vivid red
  '#FF9500', // orange
  '#FFCC00', // golden yellow
  '#34C759', // bright green
  '#00C7BE', // teal
  '#00BFFF', // deep sky blue
  '#007AFF', // royal blue
  '#5856D6', // indigo
  '#AF52DE', // purple
  '#FF0080', // magenta
  '#30D158', // lime green
  '#FF3B30', // coral red
]

export const DEFAULT_TEAMS = [
  { name: 'Time A', color: PRESET_COLORS[0], icon: TEAM_ICONS[0] },
  { name: 'Time B', color: PRESET_COLORS[3], icon: TEAM_ICONS[1] },
]
