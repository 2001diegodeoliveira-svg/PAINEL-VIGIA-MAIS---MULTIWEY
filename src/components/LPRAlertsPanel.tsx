import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';
import { formatTime, getLPRRestrictionColor } from '../utils/formatters';
import type { LPRAlert } from '../types';

export function LPRAlertsPanel() {
  const { lprAlerts } = useDataStore();
  const { viewMode } = useAppStore();

  if (viewMode === 'public') {
    return (
      <div className="bg-white border-l border-gray-200 p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Alertas LPR</h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🔒</div>
          <p className="font-medium">Alertas de leitura de placas disponíveis no modo interno</p>
        </div>
      </div>
    );
  }

  const activeAlerts = lprAlerts.filter((a: LPRAlert) => a.status === 'active');

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Alertas LPR (Leitura de Placas)</h2>
          {activeAlerts.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse">
              🚨 {activeAlerts.length} ativo(s)
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeAlerts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <span>🚨</span> Alertas Ativos - Atenção Imediata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeAlerts.map((alert: LPRAlert) => renderActiveAlertCard(alert))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Histórico de Alertas LPR ({lprAlerts.length})
            </h3>
          </div>
          <table className="w-full text-sm" role="table" aria-label="Alertas LPR">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-4 py-3">Placa</th>
                <th className="px-4 py-3">Câmera</th>
                <th className="px-4 py-3">Município</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3 text-right">Data/Hora</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lprAlerts.map((alert: LPRAlert) => (
                <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">{alert.plate}</td>
                  <td className="px-4 py-3 text-gray-700 truncate max-w-xs">{alert.cameraName}</td>
                  <td className="px-4 py-3 text-gray-700">{alert.municipality}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getLPRRestrictionColor(alert.restrictionType)}`}>
                      {alert.restrictionType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 font-mono">
                    {formatTime(alert.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      alert.status === 'active'
                        ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {alert.status === 'active' ? 'ATIVO' : 'RESOLVIDO'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function renderActiveAlertCard(alert: LPRAlert) {
  const restrictionColor = getLPRRestrictionColor(alert.restrictionType);
  const restrictionLabels: Record<string, string> = {
    stolen: 'Roubo/Furto',
    wanted: 'Procurado',
    traffic: 'Trânsito',
    other: 'Outro',
  };

  return (
    <div className="bg-white rounded-xl border-2 border-red-200 shadow-sm p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4">
        <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
          ATIVO
        </span>
      </div>
      <div className="text-3xl mb-2" aria-hidden="true">{alert.plate}</div>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{alert.cameraName}</p>
      <p className="text-sm font-medium text-gray-700 mb-1">{alert.municipality}</p>
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${restrictionColor}`}>
        {restrictionLabels[alert.restrictionType] || alert.restrictionType}
      </span>
      <p className="text-xs text-gray-500 mt-2 font-mono">{formatTime(alert.timestamp)}</p>
    </div>
  );
}
