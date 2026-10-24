import { useState } from 'react';
import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';
import { formatNumber, getActionTypeIcon } from '../utils/formatters';
import * as echarts from 'echarts';
import { useRef, useEffect } from 'react';

const TYPE_LABELS: Record<string, string> = {
  veiculo_recuperado: 'Veículos Recuperados',
  prisao_flagrante: 'Prisões em Flagrante',
  pessoa_localizada: 'Pessoas Localizadas',
  mandado_cumprido: 'Mandados Cumpridos',
  ocorrencia_elucidada: 'Ocorrências Elucidadas',
};

const TYPE_COLORS: Record<string, string> = {
  veiculo_recuperado: '#2563eb',
  prisao_flagrante: '#dc2626',
  pessoa_localizada: '#16a34a',
  mandado_cumprido: '#a855f7',
  ocorrencia_elucidada: '#d97706',
};

export function ActionsPanel() {
  const { actionStats } = useDataStore();
  const { viewMode } = useAppStore();
  const [activeTab, setActiveTab] = useState<'counters' | 'evolution' | 'ranking' | 'highlighted'>('counters');
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  if (viewMode === 'public') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4 h-full overflow-y-auto shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Resultados e Ações</h2>
          <span className="text-[10px] text-gray-400">Modo Público</span>
        </div>
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-3">📊</div>
          <p className="font-medium text-gray-700">Estatísticas detalhadas disponíveis no modo interno</p>
        </div>
      </div>
    );
  }

  if (!actionStats) return null;

  useEffect(() => {
    if (!chartRef.current || chartInstance.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        textStyle: { color: '#fff', fontSize: 12 },
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        formatter: (params) => {
          const p = Array.isArray(params) ? params[0] : params;
          return `${p.name}<br/><span style="color:#2563eb;font-weight:bold">${p.seriesName}:</span> ${p.value}`;
        },
      },
      grid: { left: 40, right: 20, top: 30, bottom: 40 },
      xAxis: {
        type: 'category',
        data: actionStats.monthlyEvolution.map((m) => m.month),
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisTick: { show: false },
        axisLabel: { color: '#64748b', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: { color: '#64748b', fontSize: 11 },
      },
      series: [
        {
          name: 'Ações',
          type: 'line',
          smooth: true,
          data: actionStats.monthlyEvolution.map((m) => m.count),
          lineStyle: { width: 3, color: '#2563eb' },
          itemStyle: { color: '#2563eb' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(37, 99, 235, 0.2)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0)' },
            ]),
          },
          symbol: 'circle',
          symbolSize: 6,
        },
      ],
    };

    chartInstance.current.setOption(option);
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
      window.removeEventListener('resize', handleResize);
    };
  }, [actionStats]);

  const totalActions = Object.values(actionStats.byType).reduce((acc: number, val: number) => acc + val, 0);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">Painel de Ações e Resultados</h2>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-mt-blue-50 text-mt-blue-700 border border-mt-blue-100">
          {actionStats.avgResponseTime} min resposta
        </span>
      </div>

      <div className="border-b border-gray-100 px-4">
        <nav className="flex gap-0.5 pb-3" role="tablist" aria-label="Abas do painel de ações">
          {[
            { id: 'counters', label: 'Contadores', icon: '📊' },
            { id: 'evolution', label: 'Evolução Mensal', icon: '📈' },
            { id: 'ranking', label: 'Ranking Municípios', icon: '🏆' },
            { id: 'highlighted', label: 'Caso em Destaque', icon: '⭐' },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-mt-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'counters' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(actionStats.byType).map(([type, count]) => (
                <div
                  key={type}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-mt-blue-200 transition-all"
                  style={{ borderLeft: `4px solid ${TYPE_COLORS[type]}20` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${TYPE_COLORS[type]}10` }}>
                      {getActionTypeIcon(type)}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">{TYPE_LABELS[type]}</p>
                      <p className="text-3xl font-bold text-gray-900 tabular-nums">{formatNumber(count)}</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(count / totalActions) * 100}%`,
                        backgroundColor: TYPE_COLORS[type],
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 text-right">
                    {((count / totalActions) * 100).toFixed(1)}% do total
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-mt-blue-50 border border-mt-blue-100 rounded-xl p-4">
              <h3 className="font-bold text-mt-blue-800 mb-2 flex items-center gap-2">
                <span>🎯</span> Total de Ações Apoiadas pelo Vigia Mais
              </h3>
              <p className="text-4xl font-bold text-mt-blue-900 tabular-nums">{formatNumber(totalActions)}</p>
              <p className="text-[10px] text-mt-blue-600 mt-1">Desde o início do programa</p>
            </div>
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="h-72">
            <div ref={chartRef} className="w-full h-full" />
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">
              {actionStats.monthlyEvolution.slice(-5).map((m) => (
                <div key={m.month} className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500">{m.month}</p>
                  <p className="font-bold text-gray-900">{formatNumber(m.count)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="space-y-2">
            <table className="w-full text-[10px]" role="table" aria-label="Ranking de municípios por ações">
              <thead>
                <tr className="text-left text-[10px] text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Município</th>
                  <th className="px-3 py-2 text-right font-medium">Ações</th>
                  <th className="px-3 py-2 text-right font-medium">Participação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {actionStats.municipalityRanking.slice(0, 10).map((item, index) => (
                  <tr key={item.municipality} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 font-bold text-gray-400">{index + 1}</td>
                    <td className="px-3 py-2 font-medium text-gray-900">{item.municipality}</td>
                    <td className="px-3 py-2 text-right font-bold text-mt-blue-600">{formatNumber(item.count)}</td>
                    <td className="px-3 py-2 text-right text-gray-500">
                      {totalActions > 0 ? ((item.count / totalActions) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'highlighted' && actionStats.highlightedCase && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-vigia-amber-50 to-vigia-amber-100 border-2 border-vigia-amber-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl" aria-hidden="true">{getActionTypeIcon(actionStats.highlightedCase.type)}</span>
                  <div>
                    <p className="text-[10px] text-vigia-amber-700 font-medium uppercase tracking-wide">Caso em Destaque</p>
                    <p className="text-xl font-bold text-vigia-amber-900">{actionStats.highlightedCase.typeLabel}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-vigia-amber-300 text-vigia-amber-900 rounded-full text-[10px] font-medium animate-pulse">
                  ⭐ DESTAQUE
                </span>
              </div>
              <p className="text-lg text-gray-800 mb-4">{actionStats.highlightedCase.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px]">
                <div>
                  <p className="text-vigia-amber-700 font-medium">Município</p>
                  <p className="font-bold text-gray-900">{actionStats.highlightedCase.municipality}</p>
                </div>
                <div>
                  <p className="text-vigia-amber-700 font-medium">Data/Hora</p>
                  <p className="font-bold text-gray-900">{new Date(actionStats.highlightedCase.date).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-vigia-amber-700 font-medium">Câmera</p>
                  <p className="font-bold text-gray-900">{actionStats.highlightedCase.cameraId || '—'}</p>
                </div>
                <div>
                  <p className="text-vigia-amber-700 font-medium">Tempo Resposta</p>
                  <p className="font-bold text-gray-900">{actionStats.avgResponseTime} min</p>
                </div>
              </div>
              {actionStats.highlightedCase.mediaUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                  {actionStats.highlightedCase.mediaType === 'video' ? (
                    <video src={actionStats.highlightedCase.mediaUrl} controls className="w-full" muted />
                  ) : (
                    <img src={actionStats.highlightedCase.mediaUrl} alt="" className="w-full" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'highlighted' && !actionStats.highlightedCase && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <div className="text-6xl mb-3">⭐</div>
            <p className="font-medium text-gray-700">Nenhum caso em destaque no momento</p>
          </div>
        )}
      </div>
    </div>
  );
}
