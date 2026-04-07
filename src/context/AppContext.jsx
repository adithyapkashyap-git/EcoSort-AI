import { createContext, useContext, useEffect, useState } from 'react';
import { hashPassword, normalizeEmail, sanitizeUser } from '../utils/auth';
import {
  defaultMetrics,
  getUserScopedStorageKey,
  readStorage,
  removeStorage,
  STORAGE_KEYS,
  writeStorage,
} from '../utils/storage';

const AppContext = createContext(null);

function mergeMetrics(storedMetrics) {
  return {
    ...defaultMetrics,
    ...storedMetrics,
  };
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    readStorage(STORAGE_KEYS.theme, 'light')
  );
  const [currentUser, setCurrentUser] = useState(() =>
    readStorage(STORAGE_KEYS.session, null)
  );
  const [latestResult, setLatestResult] = useState(null);
  const [savedResults, setSavedResults] = useState([]);
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [isUserDataReady, setIsUserDataReady] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    if (currentUser?.id) {
      setIsUserDataReady(false);
      writeStorage(STORAGE_KEYS.session, currentUser);
      setLatestResult(
        readStorage(
          getUserScopedStorageKey(currentUser.id, STORAGE_KEYS.latestResult),
          null
        )
      );
      setSavedResults(
        readStorage(
          getUserScopedStorageKey(currentUser.id, STORAGE_KEYS.savedResults),
          []
        )
      );
      setMetrics(
        mergeMetrics(
          readStorage(
            getUserScopedStorageKey(currentUser.id, STORAGE_KEYS.metrics),
            defaultMetrics
          )
        )
      );
      setIsUserDataReady(true);
      return;
    }

    removeStorage(STORAGE_KEYS.session);
    setLatestResult(null);
    setSavedResults([]);
    setMetrics(defaultMetrics);
    setIsUserDataReady(true);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.id || !isUserDataReady) {
      return;
    }

    writeStorage(
      getUserScopedStorageKey(currentUser.id, STORAGE_KEYS.latestResult),
      latestResult
    );
  }, [currentUser, isUserDataReady, latestResult]);

  useEffect(() => {
    if (!currentUser?.id || !isUserDataReady) {
      return;
    }

    writeStorage(
      getUserScopedStorageKey(currentUser.id, STORAGE_KEYS.savedResults),
      savedResults
    );
  }, [currentUser, isUserDataReady, savedResults]);

  useEffect(() => {
    if (!currentUser?.id || !isUserDataReady) {
      return;
    }

    writeStorage(
      getUserScopedStorageKey(currentUser.id, STORAGE_KEYS.metrics),
      metrics
    );
  }, [currentUser, isUserDataReady, metrics]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const signUp = async ({ email, fullName, password }) => {
    const normalizedEmail = normalizeEmail(email);
    const users = readStorage(STORAGE_KEYS.users, []);
    const userExists = users.some((user) => user.email === normalizedEmail);

    if (userExists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: crypto.randomUUID?.() || `user-${Date.now()}`,
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    writeStorage(STORAGE_KEYS.users, [...users, newUser]);
    setCurrentUser(sanitizeUser(newUser));

    return { success: true, message: 'Account created successfully.' };
  };

  const login = async ({ email, password }) => {
    const normalizedEmail = normalizeEmail(email);
    const passwordHash = await hashPassword(password);
    const users = readStorage(STORAGE_KEYS.users, []);
    const matchedUser = users.find(
      (user) =>
        user.email === normalizedEmail && user.passwordHash === passwordHash
    );

    if (!matchedUser) {
      return {
        success: false,
        message: 'Incorrect email or password. Please try again.',
      };
    }

    setCurrentUser(sanitizeUser(matchedUser));
    return { success: true, message: 'Logged in successfully.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerScan = (result) => {
    setLatestResult(result);
    setMetrics((currentMetrics) => ({
      ...currentMetrics,
      scansCompleted: currentMetrics.scansCompleted + 1,
    }));
  };

  const saveResult = (resultToSave = latestResult) => {
    if (!resultToSave) {
      return { success: false, message: 'No result available to save yet.' };
    }

    const alreadySaved = savedResults.some(
      (savedResult) => savedResult.id === resultToSave.id
    );

    if (alreadySaved) {
      return { success: false, message: 'This result is already saved.' };
    }

    setSavedResults((currentResults) => [resultToSave, ...currentResults].slice(0, 8));
    setMetrics((currentMetrics) => ({
      ...currentMetrics,
      savedResultsCount: currentMetrics.savedResultsCount + 1,
      plasticSavedKg: Number(
        (
          currentMetrics.plasticSavedKg +
          resultToSave.impactStats.plasticSavedKg
        ).toFixed(2)
      ),
      co2ReducedKg: Number(
        (
          currentMetrics.co2ReducedKg + resultToSave.impactStats.co2ReducedKg
        ).toFixed(2)
      ),
      totalPoints: currentMetrics.totalPoints + resultToSave.impactStats.points,
    }));

    return { success: true, message: 'Result saved to your EcoSort dashboard.' };
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
    theme,
    isDarkMode: theme === 'dark',
    latestResult,
    metrics,
    registerScan,
    saveResult,
    savedResults,
    signUp,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider.');
  }

  return context;
}
