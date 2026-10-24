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
  veiculo_recuperado: '#3b82f6',
  prisao_flagrante: '#ef4444',
  pessoa_localizada: '#22c55e',
  mandado_cumprido: '#a855f7',
  ocorrencia_elucidada: '#f59e0b',
};

export function ActionsPanel() {
  const { actionStats } = useDataStore();
  const { viewMode } = useAppStore();
  const [activeTab, setActiveTab] = useState<'counters' | 'evolution' | 'ranking' | 'highlighted'>('counters');
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  if (viewMode === 'public') {
    return (
      <div className="bg-white border-l border-gray-200 p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Resultados e Ações</h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📊</div>
          <p className="font-medium">Estatísticas detalhadas disponíveis no modo interno</p>
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
        backgroundColor: 'rgba(0,0,0,0.8)',
        textStyle: { color: '#fff' },
        formatter: (params) => {
          const p = Array.isArray(params) ? params[0] : params;
          return `${p.name}<br/>${p.seriesName}: ${p.value}`;
        },
      },
      grid: { left: 40, right: 20, top: 10, bottom: 30 },
      xAxis: {
        type: 'category',
        data: actionStats.monthlyEvolution.map((m: { month: string }) => m.month),
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
        axisLabel: { color: '#6b7280', fontSize: 11 },
      },
      series: [
        {
          name: 'Ações',
          type: 'line',
          smooth: true,
          data: actionStats.monthlyEvolution.map((m: { count: number }) => m.count),
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
    <div className="bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">Painel de Ações e Resultados</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Tempo médio resposta:</span>
          <span className="font-bold text-mt-blue-600">{actionStats.avgResponseTime} min</span>
        </div>
      </div>

      <div className="border-b border-gray-200 px-4">
        <nav className="flex gap-1 pb-3" role="tablist" aria-label="Abas do painel de ações">
          {[
            { id: 'counters', label: 'Contadores', icon: '📊' },
            { id: 'evolution', label: 'Evolução Mensal', icon: '📈' },
            { id: 'ranking', label: 'Ranking Municípios', icon: '🏆' },
            { id: 'highlighted', label: 'Caso em Destaque', icon: '⭐' },
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-mt-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
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
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(actionStats.byType).map(([type, count]) => (
                <div
                  key={type}
                  className="bg-white border-2 rounded-xl p-4 transition-all hover:shadow-md"
                  style={{ borderColor: `${TYPE_COLORS[type]}40` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${TYPE_COLORS[type]}20` }}>
                      {getActionTypeIcon(type)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">{TYPE_LABELS[type]}</p>
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
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {((count / totalActions) * 100).toFixed(1)}% do total
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-mt-blue-50 border-2 border-mt-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-mt-blue-800 mb-3 flex items-center gap-2">
                <span>🎯</span> Total de Ações Apoiadas pelo Vigia Mais
              </h3>
              <p className="text-4xl font-bold text-mt-blue-700 tabular-nums">{formatNumber(totalActions)}</p>
              <p className="text-sm text-mt-blue-600 mt-1">Desde o início do programa</p>
            </div>
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="h-72">
            <div ref={chartRef} className="w-full h-full" />
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">
              {actionStats.monthlyEvolution.slice(-5).map((m: { month: string; count: number }) => (
                <div key={m.month} className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">{m.month}</p>
                  <p className="font-bold text-gray-900">{formatNumber(m.count)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="space-y-2">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="pb-2">#</th>
                  <th className="pb-2">Município</th>
                  <th className="pb-2 text-right">Ações</th>
                  <th className="pb-2 text-right">Participação</th>
                </tr>
              </thead>
              <tbody>
                {actionStats.municipalityRanking.slice(0, 15).map((item, index) => (
                  <tr key={item.municipality} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2 font-bold text-gray-600">{index + 1}</td>
                    <td className="py-2 font-medium text-gray-900">{item.municipality}</td>
                    <td className="py-2 text-right font-bold text-mt-blue-600">{formatNumber(item.count)}</td>
                    <td className="py-2 text-right text-gray-600">
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
                    <p className="text-sm text-vigia-amber-800 font-medium">CASO EM DESTAQUE</p>
                    <p className="text-xl font-bold text-vigia-amber-900">{actionStats.highlightedCase.typeLabel}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-vigia-amber-300 text-vigia-amber-900 rounded-full text-sm font-medium animate-pulse">
                  ⭐ DESTAQUE
                </span>
              </div>
              <p className="text-lg text-gray-800 mb-4">{actionStats.highlightedCase.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                <div className="mt-4 rounded-lg overflow-hidden">
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
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">⭐</div>
            <p className="font-medium">Nenhum caso em destaque no momento</p>
          </div>
        )}
      </div>
    </div>
  );
}