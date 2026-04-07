import { createContext, useContext, useEffect, useState } from 'react';
import {
  defaultMetrics,
  readStorage,
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
  const [latestResult, setLatestResult] = useState(() =>
    readStorage(STORAGE_KEYS.latestResult, null)
  );
  const [savedResults, setSavedResults] = useState(() =>
    readStorage(STORAGE_KEYS.savedResults, [])
  );
  const [metrics, setMetrics] = useState(() =>
    mergeMetrics(readStorage(STORAGE_KEYS.metrics, defaultMetrics))
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.latestResult, latestResult);
  }, [latestResult]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.savedResults, savedResults);
  }, [savedResults]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.metrics, metrics);
  }, [metrics]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
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
    theme,
    isDarkMode: theme === 'dark',
    latestResult,
    metrics,
    registerScan,
    saveResult,
    savedResults,
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
