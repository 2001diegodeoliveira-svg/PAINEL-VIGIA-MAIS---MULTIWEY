import { useEffect } from 'react';
import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { usePresentationMode } from '../hooks/usePresentationMode';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { KPIBar } from './KPIBar';
import { MapView } from './MapView';
import { CameraMosaic } from './CameraMosaic';
import { TimelineFooter } from './TimelineFooter';
import { ActionsPanel } from './ActionsPanel';
import { RankingPanel } from './RankingPanel';
import { ErrorBanner } from './ErrorBanner';

export function DashboardLayout() {
  const { fetchData, startAutoRefresh } = useDataStore();
  const { isPresentationMode, screenMode, viewMode } = useAppStore();
  
  useAutoRefresh(true, 30000);
  usePresentationMode();
  useKeyboardNavigation();

  useEffect(() => {
    fetchData();
    startAutoRefresh();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [fetchData, startAutoRefresh]);

  const isFullScreen = screenMode !== 'dashboard';

  if (isPresentationMode) {
    return (
      <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
        <KPIBar />
        <div className="flex-1 flex overflow-hidden">
          {screenMode === 'map' && <MapView />}
          {screenMode === 'actions' && <ActionsPanel />}
          {screenMode === 'ranking' && <ActionsPanel />}
          {screenMode === 'dashboard' && (
            <>
              <div className="flex-1 flex flex-col md:flex-row min-w-0">
                <div className="flex-1 md:max-w-2xl flex flex-col min-w-0">
                  <MapView />
                </div>
                <CameraMosaic />
              </div>
            </>
          )}
        </div>
        <TimelineFooter />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-full mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center gap-3">
              <img
                src="/logo-vigiamais.png"
                alt="Vigia Mais MT"
                className="h-10 md:h-12 w-auto object-contain"
              />
              <div className="hidden md:block">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Vigia Mais MT</h1>
                <p className="text-xs text-gray-500">Sala de Situação - Monitoramento Inteligente</p>
              </div>
            </div>
            <img
              src="/logo-multiway.png"
              alt="Multiway"
              className="h-10 md:h-12 w-auto object-contain"
            />
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm">
                <span className="w-2 h-2 rounded-full bg-mt-green-500 animate-pulse" />
                <span className="font-mono" id="clock"></span>
              </div>
              <select
                value={viewMode}
                onChange={(e) => useAppStore.getState().setViewMode(e.target.value as 'public' | 'internal')}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-mt-blue-500"
                aria-label="Modo de visualização"
              >
                <option value="public">Público</option>
                <option value="interno">Interno</option>
              </select>
              <button
                onClick={() => useAppStore.getState().setPresentationMode(!isPresentationMode)}
                className="px-4 py-1.5 text-sm font-medium bg-mt-blue-600 text-white rounded-lg hover:bg-mt-blue-700 focus:outline-none focus:ring-2 focus:ring-mt-blue-500 focus:ring-offset-2"
              >
                {isPresentationMode ? 'Sair Apresentação' : 'Modo Apresentação'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <ErrorBanner />

      <KPIBar />

      <main className="flex-1 flex overflow-hidden min-h-0">
        <div className={`flex-1 flex flex-col md:flex-row min-w-0 transition-all duration-300 ${isFullScreen ? 'md:max-w-full' : ''}`}>
          <div className="flex-1 flex flex-col min-w-0">
            <MapView />
          </div>
          {!isFullScreen && <CameraMosaic />}
        </div>
        {isFullScreen && screenMode === 'actions' && <ActionsPanel />}
        {isFullScreen && screenMode === 'ranking' && <RankingPanel />}
      </main>

      <TimelineFooter />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            function updateClock() {
              const el = document.getElementById('clock');
              if (el) el.textContent = new Date().toLocaleTimeString('pt-BR');
            }
            setInterval(updateClock, 1000);
            updateClock();
          `,
        }}
      />
    </div>
  );
}