import { create } from 'zustand';
import type { DashboardData, Camera, Municipality, Action, KPIData, ActionStats, NetworkHealth, LPRAlert, BeforeAfterData, CoverageSuggestion } from '../types';
import { dashboardApi } from '../services/dashboardApi';

interface DataStore {
  data: DashboardData | null;
  cameras: Camera[];
  municipalities: Municipality[];
  actions: Action[];
  actionStats: ActionStats | null;
  kpis: KPIData | null;
  lprAlerts: LPRAlert[];
  networkHealth: NetworkHealth | null;
  beforeAfter: BeforeAfterData[];
  coverageSuggestions: CoverageSuggestion[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number;
  fetchInterval: number;
  
  fetchData: () => Promise<void>;
  fetchKPIs: () => Promise<void>;
  fetchCameras: () => Promise<void>;
  fetchMunicipalities: () => Promise<void>;
  fetchActions: () => Promise<void>;
  fetchLPRAlerts: () => Promise<void>;
  fetchNetworkHealth: () => Promise<void>;
  fetchBeforeAfter: () => Promise<void>;
  fetchCoverageSuggestions: () => Promise<void>;
  setFetchInterval: (interval: number) => void;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  refreshIntervalId: ReturnType<typeof setInterval> | null;
}

export const useDataStore = create<DataStore>((set, get) => ({
  data: null,
  cameras: [],
  municipalities: [],
  actions: [],
  actionStats: null,
  kpis: null,
  lprAlerts: [],
  networkHealth: null,
  beforeAfter: [],
  coverageSuggestions: [],
  isLoading: false,
  error: null,
  lastFetch: 0,
  fetchInterval: 30000,
  refreshIntervalId: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await dashboardApi.fetchDashboardData();
      set({
        data,
        cameras: data.cameras,
        municipalities: data.municipalities,
        actions: data.actions,
        actionStats: data.actionStats,
        kpis: data.kpis,
        lprAlerts: data.lprAlerts,
        networkHealth: data.networkHealth,
        beforeAfter: data.beforeAfter,
        coverageSuggestions: data.coverageSuggestions,
        lastFetch: Date.now(),
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Falha ao carregar dados', isLoading: false });
    }
  },

  fetchKPIs: async () => {
    try {
      const kpis = await dashboardApi.fetchKPIs();
      set({ kpis });
    } catch (error) {
      console.error('Failed to fetch KPIs:', error);
    }
  },

  fetchCameras: async () => {
    try {
      const cameras = await dashboardApi.fetchCameras();
      set({ cameras });
    } catch (error) {
      console.error('Failed to fetch cameras:', error);
    }
  },

  fetchMunicipalities: async () => {
    try {
      const municipalities = await dashboardApi.fetchMunicipalities();
      set({ municipalities });
    } catch (error) {
      console.error('Failed to fetch municipalities:', error);
    }
  },

  fetchActions: async () => {
    try {
      const actions = await dashboardApi.fetchActions();
      set({ actions });
    } catch (error) {
      console.error('Failed to fetch actions:', error);
    }
  },

  fetchLPRAlerts: async () => {
    try {
      const lprAlerts = await dashboardApi.fetchLPRAlerts();
      set({ lprAlerts });
    } catch (error) {
      console.error('Failed to fetch LPR alerts:', error);
    }
  },

  fetchNetworkHealth: async () => {
    try {
      const networkHealth = await dashboardApi.fetchNetworkHealth();
      set({ networkHealth });
    } catch (error) {
      console.error('Failed to fetch network health:', error);
    }
  },

  fetchBeforeAfter: async () => {
    try {
      const beforeAfter = await dashboardApi.fetchBeforeAfter();
      set({ beforeAfter });
    } catch (error) {
      console.error('Failed to fetch before/after:', error);
    }
  },

  fetchCoverageSuggestions: async () => {
    try {
      const coverageSuggestions = await dashboardApi.fetchCoverageSuggestions();
      set({ coverageSuggestions });
    } catch (error) {
      console.error('Failed to fetch coverage suggestions:', error);
    }
  },

  setFetchInterval: (interval) => set({ fetchInterval: interval }),

  startAutoRefresh: () => {
    const { refreshIntervalId, fetchInterval, fetchData } = get();
    if (refreshIntervalId) return;
    
    const id = setInterval(fetchData, fetchInterval);
    set({ refreshIntervalId: id });
  },

  stopAutoRefresh: () => {
    const { refreshIntervalId } = get();
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      set({ refreshIntervalId: null });
    }
  },
}));
