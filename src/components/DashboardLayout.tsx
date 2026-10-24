import { useEffect } from 'react';
import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { usePresentationMode } from '../hooks/usePresentationMode';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { KPIBar } from './KPIBar';
import { MapView } from './MapView';
import { CameraLayersPanel } from './CameraLayersPanel';
import { TimelineFooter } from './TimelineFooter';
import { ActionsPanel } from './ActionsPanel';
import { RankingPanel } from './RankingPanel';
import { ErrorBanner } from './ErrorBanner';
import { SearchFilter } from './SearchFilter';
import { Maximize2, Minimize2 } from 'lucide-react';

export function DashboardLayout() {
  const { fetchData, startAutoRefresh } = useDataStore();
  const { isPresentationMode, screenMode, viewMode, isFullscreen, toggleFullscreen } = useAppStore();

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
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 h-12 md:h-14 px-4 md:px-6">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3 animate-slide-down">
              <img
                src="/logo-vigiamais.png"
                alt="Vigia Mais MT"
                className="h-8 md:h-10 w-auto object-contain"
              />
              <div className="hidden md:block">
                <h1 className="text-sm md:text-base font-bold text-blue-900 tracking-tight">
                  Vigia Mais MT
                </h1>
                <p className="text-[10px] md:text-xs text-blue-600 uppercase tracking-wider">
                  Sala de Situação
                </p>
              </div>
            </div>
            <img
              src="/logo-multiway.png"
              alt="Multiway"
              className="h-8 md:h-10 w-auto object-contain hidden md:block animate-fade-in"
              style={animationDelay(0.2)}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => useAppStore.getState().setPresentationMode(false)}
                className="btn-blue-outline animate-bounce-in"
              >
                Sair Apresentação
              </button>
            </div>
          </div>
        </header>

        <KPIBar />

        <div className="flex-1 flex overflow-hidden">
          {screenMode === 'map' && <MapView />}
          {screenMode === 'actions' && <ActionsPanel />}
          {screenMode === 'ranking' && <RankingPanel />}
          {screenMode === 'dashboard' && (
            <>
              <div className="flex-1 flex flex-col md:flex-row min-w-0">
                <div className="flex-1 md:max-w-[65vw] flex flex-col min-w-0">
                  <MapView />
                </div>
                <CameraLayersPanel />
              </div>
            </>
          )}
        </div>

        <TimelineFooter />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col overflow-hidden">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 h-12 md:h-14 px-4 md:px-6 shadow-sm">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3 animate-slide-down">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-blue icon-bounce">
              VM
            </div>
            <div className="hidden md:block">
              <h1 className="text-sm md:text-base font-bold text-blue-900 tracking-tight">
                Vigia Mais MT
              </h1>
              <p className="text-[10px] md:text-xs text-blue-600 uppercase tracking-wider">
                Sala de Situação - Monitoramento Inteligente
              </p>
            </div>
          </div>
          <img
            src="/logo-multiway.png"
            alt="Multiway"
            className="h-8 md:h-10 w-auto object-contain hidden md:block animate-fade-in"
            style={animationDelay(0.2)}
          />
          <div className="flex items-center gap-2">
            <SearchFilter />
            <select
              value={viewMode}
              onChange={(e) =>
                useAppStore
                  .getState()
                  .setViewMode(e.target.value as 'public' | 'internal')
              }
              className="input-blue text-xs"
              aria-label="Modo de visualização"
            >
              <option value="public">Público</option>
              <option value="interno">Interno</option>
            </select>
            <button
              onClick={() =>
                useAppStore.getState().setPresentationMode(!isPresentationMode)
              }
              className="btn-blue animate-bounce-in"
            >
              {isPresentationMode ? 'Sair Apresentação' : 'Modo Apresentação'}
            </button>
          </div>
        </div>
      </header>

      <ErrorBanner />

      <KPIBar />

      <main className="flex-1 flex overflow-hidden min-h-0 relative">
        <div
          className={`flex-1 flex flex-col md:flex-row min-w-0 transition-all duration-300 ease-in-out ${
            isFullScreen ? 'md:max-w-full' : ''
          }`}
        >
          <div className="flex-1 flex flex-col min-w-0 relative">
            <MapView />
          </div>
          {!isFullScreen && <CameraLayersPanel />}
        </div>
        {isFullScreen && screenMode === 'actions' && <ActionsPanel />}
        {isFullScreen && screenMode === 'ranking' && <RankingPanel />}

        <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
          <button
            onClick={() => toggleFullscreen()}
            className="p-2 bg-white/90 backdrop-blur border border-gray-200 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white shadow-blue transition-all duration-200 active:scale-95"
            aria-label={isFullscreen ? 'Sair tela cheia' : 'Tela cheia'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </main>

      <TimelineFooter />
    </div>
  );
}

function animationDelay(seconds: number) {
  return { animationDelay: `${seconds}s` } as React.CSSProperties;
}

