import { useEffect, useCallback } from 'react';
import { useAppStore } from '../stores/appStore';

export function useKeyboardNavigation() {
  const { 
    screenMode, 
    setScreenMode, 
    isPresentationMode, 
    setPresentationMode,
    viewMode,
    setViewMode,
    selectedMunicipality,
    setSelectedMunicipality,
    setSelectedCamera,
    toggleFullscreen,
  } = useAppStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if typing in input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (event.key) {
      case 'F11':
        event.preventDefault();
        toggleFullscreen();
        break;

      case 'Escape':
        setSelectedMunicipality(null);
        setSelectedCamera(null);
        if (isPresentationMode) {
          setPresentationMode(false);
        }
        break;

      case 'p':
      case 'P':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          setPresentationMode(!isPresentationMode);
        }
        break;

      case 'ArrowRight':
        if (isPresentationMode) {
          // Handled by presentation mode
        } else if (screenMode === 'map' && selectedMunicipality) {
          // Could navigate to next municipality
        }
        break;

      case 'ArrowLeft':
        if (isPresentationMode) {
          // Handled by presentation mode
        }
        break;

      case '1':
        if (event.altKey) {
          event.preventDefault();
          setScreenMode('dashboard');
        }
        break;

      case '2':
        if (event.altKey) {
          event.preventDefault();
          setScreenMode('map');
        }
        break;

      case '3':
        if (event.altKey) {
          event.preventDefault();
          setScreenMode('actions');
        }
        break;

      case '4':
        if (event.altKey) {
          event.preventDefault();
          setScreenMode('ranking');
        }
        break;

      case 'v':
      case 'V':
        if (event.altKey) {
          event.preventDefault();
          setViewMode(viewMode === 'public' ? 'internal' : 'public');
        }
        break;

      case 'r':
      case 'R':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          // Trigger refresh
          window.dispatchEvent(new CustomEvent('dashboard:refresh'));
        }
        break;
    }
  }, [
    screenMode,
    isPresentationMode,
    viewMode,
    selectedMunicipality,
    setScreenMode,
    setPresentationMode,
    setViewMode,
    setSelectedMunicipality,
    setSelectedCamera,
    toggleFullscreen,
  ]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { handleKeyDown };
}