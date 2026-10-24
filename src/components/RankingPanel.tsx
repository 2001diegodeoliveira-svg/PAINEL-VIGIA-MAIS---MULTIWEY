import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';
import { formatNumber, formatPercent, getStatusColor, getStatusLabel } from '../utils/formatters';

export function RankingPanel() {
  const { municipalities, actionStats } = useDataStore();
  const { viewMode } = useAppStore();

  if (viewMode === 'public') {
    return (
      <div className="bg-white border-l border-gray-200 p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Ranking de Municípios</h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🏆</div>
          <p className="font-medium">Ranking detalhado disponível no modo interno</p>
        </div>
      </div>
    );
  }

  if (!actionStats) return null;

  const totalActions = Object.values(actionStats.byType).reduce((acc, val) => acc + val, 0);

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Ranking de Municípios</h2>
        <span className="text-xs text-gray-500">Total de ações: {formatNumber(totalActions)}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Top municípios por ações */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
            Municípios com Mais Ações
          </h3>
          <div className="space-y-2">
            {actionStats.municipalityRanking.map((item, index) => (
              <div
                key={item.municipality}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-mt-blue-50 text-mt-blue-700 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.municipality}</p>
                  <p className="text-xs text-gray-500">Código: {item.code}</p>
                </div>
                <div className="w-24">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-mt-blue-600">{formatNumber(item.count)}</span>
                    <span className="text-xs text-gray-400">
                      {totalActions > 0 ? formatPercent((item.count / totalActions) * 100) : '0%'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-mt-blue-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${totalActions > 0 ? (item.count / totalActions) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela detalhada de municípios */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm" role="table" aria-label="Detalhamento por município">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3">Município</th>
                <th className="px-4 py-3 text-right">Câmeras Total</th>
                <th className="px-4 py-3 text-right">Online</th>
                <th className="px-4 py-3 text-right">Offline</th>
                <th className="px-4 py-3 text-right">Disponibilidade</th>
                <th className="px-4 py-3 text-right">Ações</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {municipalities
                .slice()
                .sort((a, b) => b.actionsCount - a.actionsCount)
                .map((muni) => {
                  const availability =
                    muni.camerasCount > 0
                      ? Math.round((muni.camerasOnline / muni.camerasCount) * 1000) / 10
                      : 0;
                  return (
                    <tr
                      key={muni.code}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{muni.name}</div>
                        <div className="text-xs text-gray-500">{muni.code}</div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">{muni.camerasCount}</td>
                      <td className="px-4 py-3 text-right text-mt-green-600 font-medium">
                        {muni.camerasOnline}
                      </td>
                      <td className="px-4 py-3 text-right text-vigia-red-600 font-medium">
                        {muni.camerasOffline}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${availability >= 95 ? 'bg-mt-green-50 text-mt-green-700 border border-mt-green-200' : availability >= 85 ? 'bg-vigia-amber-50 text-vigia-amber-700 border border-vigia-amber-200' : 'bg-vigia-red-50 text-vigia-red-700 border border-vigia-red-200'}`}>
                          {availability}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        {muni.actionsCount}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(muni.status)}`}>
                          {getStatusLabel(muni.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
