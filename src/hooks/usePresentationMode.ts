import { useEffect, useCallback } from 'react';
import { useAppStore } from '../stores/appStore';

const SCREENS = ['dashboard', 'map', 'actions', 'ranking'] as const;
const SCREEN_DURATION = 30000; // 30 seconds per screen

export function usePresentationMode() {
  const { isPresentationMode, presentationCurrentScreen, setPresentationCurrentScreen, setScreenMode } = useAppStore();

  const nextScreen = useCallback(() => {
    const next = (presentationCurrentScreen + 1) % SCREENS.length;
    setPresentationCurrentScreen(next);
    setScreenMode(SCREENS[next]);
  }, [presentationCurrentScreen, setPresentationCurrentScreen, setScreenMode]);

  const prevScreen = useCallback(() => {
    const prev = (presentationCurrentScreen - 1 + SCREENS.length) % SCREENS.length;
    setPresentationCurrentScreen(prev);
    setScreenMode(SCREENS[prev]);
  }, [presentationCurrentScreen, setPresentationCurrentScreen, setScreenMode]);

  useEffect(() => {
    if (!isPresentationMode) return;

    const interval = setInterval(nextScreen, SCREEN_DURATION);
    setScreenMode(SCREENS[presentationCurrentScreen]);

    return () => clearInterval(interval);
  }, [isPresentationMode, presentationCurrentScreen, nextScreen, setScreenMode]);

  return { isPresentationMode, currentScreen: SCREENS[presentationCurrentScreen], nextScreen, prevScreen };
}