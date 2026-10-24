import { useDataStore } from '../stores/dataStore';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function ErrorBanner() {
  const { error, isLoading } = useDataStore();

  if (!error && !isLoading) return null;

  if (isLoading && !error) {
    return (
      <div className="fixed top-0 left-0 right-4 z-50 bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center gap-3 text-sm text-blue-800">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span>Carregando dados do Vigia Mais...</span>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-4 z-50 bg-red-50 border-b border-red-200 px-4 py-3 flex items-start gap-3 text-sm text-red-800">
      <AlertTriangle className="w-4 h-4 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium">Falha ao carregar dados</p>
        <p className="text-[10px] mt-0.5 opacity-90">{error}</p>
      </div>
      <button
        onClick={() => {
          window.dispatchEvent(new CustomEvent('dashboard:refresh'));
        }}
        className="px-3 py-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
        aria-label="Tentar novamente"
      >
        Tentar Novamente
      </button>
    </div>
  );
}

