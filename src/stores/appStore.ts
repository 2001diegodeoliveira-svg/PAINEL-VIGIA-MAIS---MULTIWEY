import { create } from 'zustand';
import type { AppState, ViewMode, ScreenMode, Action } from '../types';

interface AppStore extends AppState {
  setViewMode: (mode: ViewMode) => void;
  setScreenMode: (mode: ScreenMode) => void;
  setSelectedMunicipality: (code: string | null) => void;
  setSelectedCamera: (id: string | null) => void;
  setHighlightedAction: (action: Action | null) => void;
  setPresentationMode: (enabled: boolean) => void;
  setPresentationCurrentScreen: (screen: number) => void;
  setFilters: (filters: Partial<AppState['filters']>) => void;
  resetFilters: () => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
}

const defaultFilters = {
  region: 'all',
  period: 'month',
  actionType: 'all',
};

export const useAppStore = create<AppStore>((set) => ({
  viewMode: 'internal' as ViewMode,
  screenMode: 'dashboard' as ScreenMode,
  selectedMunicipality: null,
  selectedCamera: null,
  highlightedAction: null,
  isPresentationMode: false,
  presentationCurrentScreen: 0,
  filters: defaultFilters,
  isFullscreen: false,

  setViewMode: (mode) => set({ viewMode: mode }),
  setScreenMode: (mode) => set({ screenMode: mode }),
  setSelectedMunicipality: (code) => set({ selectedMunicipality: code }),
  setSelectedCamera: (id) => set({ selectedCamera: id }),
  setHighlightedAction: (action) => set({ highlightedAction: action }),
  setPresentationMode: (enabled) => set({ isPresentationMode: enabled }),
  setPresentationCurrentScreen: (screen) => set({ presentationCurrentScreen: screen }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
}));