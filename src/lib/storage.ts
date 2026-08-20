import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadState<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveState<T>(key: string, state: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(state));
  } catch {}
}

export async function clearState(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
}
