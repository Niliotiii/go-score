export function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const sec = String(totalSeconds % 60).padStart(2, '0')
  return `${m}:${sec}`
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
