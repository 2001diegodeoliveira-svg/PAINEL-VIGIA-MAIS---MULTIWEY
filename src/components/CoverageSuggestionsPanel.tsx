import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';

export function CoverageSuggestionsPanel() {
  const { coverageSuggestions } = useDataStore();
  const { viewMode } = useAppStore();

  if (viewMode === 'public') {
    return (
      <div className="bg-white border-l border-gray-200 p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Sugestões de Cobertura</h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="font-medium">Plano de expansão disponível no modo interno</p>
        </div>
      </div>
    );
  }

  if (!coverageSuggestions || coverageSuggestions.length === 0) return null;

  const priorityColors: Record<string, string> = {
    high: 'bg-vigia-red-50 text-vigia-red-700 border border-vigia-red-200',
    medium: 'bg-vigia-amber-50 text-vigia-amber-700 border border-vigia-amber-200',
    low: 'bg-mt-green-50 text-mt-green-700 border border-mt-green-200',
  };

  const priorityLabels: Record<string, string> = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
  };

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Sugestões de Expansão de Cobertura</h2>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-mt-blue-100 text-mt-blue-700 text-xs font-medium">
            {coverageSuggestions.length} áreas sugeridas
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {coverageSuggestions.map((suggestion: { municipality: string; municipalityCode: string; latitude: number; longitude: number; priority: 'high' | 'medium' | 'low'; reason: string; estimatedCameras: number }) => (
            <div
              key={suggestion.municipalityCode}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{suggestion.municipality}</h3>
                  <p className="text-sm text-gray-600">{suggestion.municipalityCode}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${priorityColors[suggestion.priority]}`}>
                  Prioridade {priorityLabels[suggestion.priority]}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-700">{suggestion.reason}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Câmeras Estimadas</p>
                  <p className="font-bold text-gray-900 tabular-nums">{suggestion.estimatedCameras}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Localização</p>
                  <p className="font-mono text-xs text-gray-700">
                    {suggestion.latitude.toFixed(4)}, {suggestion.longitude.toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1e3a8a' }} />
                  <p className="text-xs text-gray-600">Sugestão para mapa</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
