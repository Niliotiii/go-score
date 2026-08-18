import { useEffect } from 'react'

export function loadState(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveState(key, state) {
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch {}
}

export function clearState(key) {
  try {
    localStorage.removeItem(key)
  } catch {}
}

export function usePersistence(key, state) {
  useEffect(() => {
    saveState(key, state)
  }, [key, state])
}
