import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';

export function NetworkHealthPanel() {
  const { networkHealth } = useDataStore();
  const { viewMode } = useAppStore();

  if (viewMode === 'public') {
    return (
      <div className="bg-white border-l border-gray-200 p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Saúde da Rede</h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📶</div>
          <p className="font-medium">Informações de rede disponíveis no modo interno</p>
        </div>
      </div>
    );
  }

  if (!networkHealth) return null;

  const uptimeClass =
    networkHealth.uptime >= 95
      ? 'text-mt-green-600'
      : networkHealth.uptime >= 85
      ? 'text-vigia-amber-600'
      : 'text-vigia-red-600';

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Saúde da Rede de Câmeras</h2>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${uptimeClass} bg-gray-100`}>
          Uptime: {networkHealth.uptime}%
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* KPIs de rede */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-mt-blue-50 border border-mt-blue-200 rounded-xl p-4">
            <p className="text-xs text-mt-blue-600 uppercase tracking-wide font-medium mb-1">Uptime da Rede</p>
            <p className="text-3xl font-bold text-mt-blue-900 tabular-nums">{networkHealth.uptime}%</p>
          </div>
          <div className="bg-vigia-red-50 border border-vigia-red-200 rounded-xl p-4">
            <p className="text-xs text-vigia-red-600 uppercase tracking-wide font-medium mb-1">Falhas Recorrentes</p>
            <p className="text-3xl font-bold text-vigia-red-900 tabular-nums">{networkHealth.recurringFailures}</p>
          </div>
          <div className="bg-mt-blue-50 border border-mt-blue-200 rounded-xl p-4">
            <p className="text-xs text-mt-blue-600 uppercase tracking-wide font-medium mb-1">Tempo Médio de Reparo</p>
            <p className="text-3xl font-bold text-mt-blue-900 tabular-nums">{networkHealth.avgRepairTime}h</p>
          </div>
        </div>

        {/* Barra de progresso do uptime */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Disponibilidade da Rede</span>
            <span className="text-sm font-mono text-gray-900">{networkHealth.uptime}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                networkHealth.uptime >= 95 ? 'bg-mt-green-500' :
                networkHealth.uptime >= 85 ? 'bg-vigia-amber-500' :
                'bg-vigia-red-500'
              }`}
              style={{ width: `${networkHealth.uptime}%` }}
            />
          </div>
        </div>

        {/* Câmeras com problemas */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <span>⚠️</span> Câmeras com Problemas ({networkHealth.camerasWithIssues.length})
            </h3>
          </div>
          <table className="w-full text-sm" role="table" aria-label="Câmeras com falhas recorrentes">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-4 py-3">Câmera</th>
                <th className="px-4 py-3">Município</th>
                <th className="px-4 py-3 text-right">Falhas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {networkHealth.camerasWithIssues.map((cam: { cameraId: string; name: string; municipality: string; failuresCount: number }) => (
                <tr key={cam.cameraId} className="hover:bg-red-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{cam.name}</td>
                  <td className="px-4 py-3 text-gray-700">{cam.municipality}</td>
                  <td className="px-4 py-3 text-right font-bold text-vigia-red-600">
                    {cam.failuresCount}
                  </td>
                </tr>
              ))}
              {networkHealth.camerasWithIssues.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                    Nenhuma câmera com falhas recorrentes no momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
