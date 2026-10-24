import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';
import { formatNumber, formatPercent } from '../utils/formatters';

export function BeforeAfterPanel() {
  const { beforeAfter } = useDataStore();
  const { viewMode } = useAppStore();

  if (viewMode === 'public') {
    return (
      <div className="bg-white border-l border-gray-200 p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Impacto - Antes vs Depois</h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📊</div>
          <p className="font-medium">Análise de impacto disponível no modo interno</p>
        </div>
      </div>
    );
  }

  if (!beforeAfter || beforeAfter.length === 0) return null;

  const avgReduction =
    beforeAfter.reduce((sum: number, item: { reductionPercent: number }) => sum + item.reductionPercent, 0) / beforeAfter.length;

  return (
    <div className="bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Impacto do Vigia Mais</h2>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-mt-green-100 text-mt-green-700 text-xs font-medium">
            {formatPercent(avgReduction)} redução média
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Resumo geral */}
        <div className="bg-mt-blue-50 border-2 border-mt-blue-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-mt-blue-600 uppercase tracking-wide font-medium mb-1">
                Redução Média de Ocorrências
              </p>
              <p className="text-4xl font-bold text-mt-blue-900 tabular-nums">
                {formatPercent(avgReduction)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-mt-blue-600 uppercase tracking-wide font-medium mb-1">
                Municípios Analisados
              </p>
              <p className="text-2xl font-bold text-mt-blue-900 tabular-nums">{beforeAfter.length}</p>
            </div>
          </div>
        </div>

        {/* Lista por município */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Comparativo por Município (Antes vs Depois da Instalação)
            </h3>
          </div>
          <table className="w-full text-sm" role="table" aria-label="Comparativo antes e depois">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-4 py-3">Município</th>
                <th className="px-4 py-3 text-right">Antes</th>
                <th className="px-4 py-3 text-right">Depois</th>
                <th className="px-4 py-3 text-right">Redução</th>
                <th className="px-4 py-3 text-right">Período</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {beforeAfter
                .slice()
                .sort((a: { reductionPercent: number }, b: { reductionPercent: number }) => b.reductionPercent - a.reductionPercent)
                .map((item: { municipality: string; municipalityCode: string; beforeInstallation: { totalOccurrences: number; period: string }; afterInstallation: { totalOccurrences: number; period: string }; reductionPercent: number }) => (
                  <tr key={item.municipalityCode} className="hover:bg-green-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.municipality}</td>
                    <td className="px-4 py-3 text-right text-gray-700 font-mono">
                      {formatNumber(item.beforeInstallation.totalOccurrences)}
                    </td>
                    <td className="px-4 py-3 text-right text-mt-green-600 font-mono font-medium">
                      {formatNumber(item.afterInstallation.totalOccurrences)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-mt-green-50 text-mt-green-700 border border-mt-green-200`}>
                        -{formatPercent(item.reductionPercent)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-500 font-mono">
                      {item.beforeInstallation.period} → {item.afterInstallation.period}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Legenda */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Como ler este painel</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-red-500" aria-hidden="true">▲</span>
              <span className="text-gray-700">Antes = ocorrências antes da instalação das câmeras</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-mt-green-500" aria-hidden="true">▼</span>
              <span className="text-gray-700">Depois = ocorrências após a instalação das câmeras</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-mt-blue-500" aria-hidden="true">📉</span>
              <span className="text-gray-700">Redução = percentual de queda nas ocorrências</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
