import { useDataStore } from '../stores/dataStore';

export function ErrorBanner() {
  const { error, isLoading } = useDataStore();

  if (!error && !isLoading) return null;

  if (isLoading && !error) {
    return (
      <div className="fixed top-0 left-0 right-4 z-50 bg-mt-blue-50 border-b border-mt-blue-200 px-4 py-2 flex items-center gap-3 text-sm text-mt-blue-800">
        <span className="animate-spin" aria-hidden="true">⟳</span>
        <span>Carregando dados do Vigia Mais...</span>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-4 z-50 bg-vigia-red-50 border-b border-vigia-red-200 px-4 py-3 flex items-start gap-3 text-sm text-vigia-red-800">
      <span className="mt-0.5" aria-hidden="true">⚠️</span>
      <div className="flex-1">
        <p className="font-medium">Falha ao carregar dados</p>
        <p className="text-xs mt-0.5 opacity-90">{error}</p>
      </div>
      <button
        onClick={() => {
          window.dispatchEvent(new CustomEvent('dashboard:refresh'));
        }}
        className="px-3 py-1.5 text-vigia-red-600 hover:bg-vigia-red-100 rounded-lg transition-colors"
        aria-label="Tentar novamente"
      >
        Tentar Novamente
      </button>
    </div>
  );
}
