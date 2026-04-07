export const STORAGE_KEYS = {
  theme: 'ecosort-theme',
  users: 'ecosort-users',
  session: 'ecosort-session',
  latestResult: 'ecosort-latest-result',
  savedResults: 'ecosort-saved-results',
  metrics: 'ecosort-metrics',
};

export const defaultMetrics = {
  scansCompleted: 0,
  savedResultsCount: 0,
  plasticSavedKg: 0,
  co2ReducedKg: 0,
  totalPoints: 0,
};

export function readStorage(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallbackValue;
  } catch (error) {
    console.error(`Unable to read storage key: ${key}`, error);
    return fallbackValue;
  }
}

export function writeStorage(key, value) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to write storage key: ${key}`, error);
  }
}

export function removeStorage(key) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Unable to remove storage key: ${key}`, error);
  }
}

export function getUserScopedStorageKey(userId, key) {
  return `ecosort-user-${userId}-${key}`;
}
