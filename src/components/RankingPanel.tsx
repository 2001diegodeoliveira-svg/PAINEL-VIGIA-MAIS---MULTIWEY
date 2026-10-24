import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';
import { formatNumber, formatPercent, getStatusColor, getStatusLabel } from '../utils/formatters';
import { Trophy } from 'lucide-react';

export function RankingPanel() {
  const { municipalities, actionStats } = useDataStore();
  const { viewMode } = useAppStore();

  if (viewMode === 'public') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4 h-full overflow-y-auto shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Ranking de Municípios</h2>
        </div>
        <div className="text-center py-12 text-gray-400">
          <Trophy className="w-12 h-12 text-gray-300 mb-3 opacity-50" />
          <p className="font-medium text-gray-700">Ranking detalhado disponível no modo interno</p>
        </div>
      </div>
    );
  }

  if (!actionStats) return null;

  const totalActions = Object.values(actionStats.byType).reduce((acc, val) => acc + val, 0);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-gray-900">Ranking de Municípios</h2>
          <span className="text-xs text-gray-500">Total de ações: {formatNumber(totalActions)}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wide mb-3">
            Municípios com Mais Ações
          </h3>
          <div className="space-y-2">
            {actionStats.municipalityRanking.map((item, index) => (
              <div
                key={item.municipality}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.municipality}</p>
                  <p className="text-[10px] text-gray-500">Código: {item.code}</p>
                </div>
                <div className="w-24">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600">{formatNumber(item.count)}</span>
                    <span className="text-[10px] text-gray-400">
                      {totalActions > 0 ? formatPercent((item.count / totalActions) * 100) : '0%'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
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

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-[10px]" role="table" aria-label="Detalhamento por município">
            <thead>
              <tr className="text-left text-[10px] text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
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
                        <div className="text-[10px] text-gray-500">{muni.code}</div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">{muni.camerasCount}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">
                        {muni.camerasOnline}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600 font-medium">
                        {muni.camerasOffline}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${availability >= 95 ? 'bg-green-50 text-green-700 border border-green-200' : availability >= 85 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
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

