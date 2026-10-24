import { useEffect, useCallback } from 'react';
import { useDataStore } from '../stores/dataStore';

export function useAutoRefresh(enabled = true, interval?: number) {
  const { fetchData, startAutoRefresh, stopAutoRefresh, setFetchInterval, fetchInterval } = useDataStore();

  const effectiveInterval = interval ?? fetchInterval;

  useEffect(() => {
    if (enabled) {
      if (effectiveInterval !== fetchInterval) {
        setFetchInterval(effectiveInterval);
      }
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }

    return () => stopAutoRefresh();
  }, [enabled, effectiveInterval, fetchInterval, startAutoRefresh, stopAutoRefresh, setFetchInterval]);

  const refreshNow = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { refreshNow };
}