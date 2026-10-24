import { useDataStore } from '../stores/dataStore';
import { formatNumber, formatPercent } from '../utils/formatters';

export function KPIBar() {
  const { kpis, isLoading, lastFetch } = useDataStore();

  if (isLoading && !kpis) {
    return (
      <div className="grid grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-white border-b border-gray-200 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-24 md:h-32" />
        ))}
      </div>
    );
  }

  if (!kpis) return null;

  const availabilityClass = kpis.camerasAvailability >= 95 ? 'text-mt-green-600' : 
                            kpis.camerasAvailability >= 85 ? 'text-vigia-amber-600' : 'text-vigia-red-600';

  const kpiItems = [
    {
      label: 'Câmeras Ativas / Total',
      value: `${formatNumber(kpis.camerasActive)} / ${formatNumber(kpis.camerasTotal)}`,
      subValue: `${formatPercent(kpis.camerasAvailability)} disponibilidade`,
      subClass: availabilityClass,
      icon: '📷',
      color: 'mt-blue',
    },
    {
      label: 'Municípios Atendidos',
      value: `${kpis.municipalitiesAttended} de ${kpis.municipalitiesTotal}`,
      subValue: `${formatPercent((kpis.municipalitiesAttended / kpis.municipalitiesTotal) * 100)} cobertura`,
      subClass: 'text-mt-green-600',
      icon: '🏙️',
      color: 'mt-green',
    },
    {
      label: 'Ações no Mês / Ano',
      value: `${formatNumber(kpis.actionsMonth)} / ${formatNumber(kpis.actionsYear)}`,
      subValue: 'Mês atual / Acumulado',
      subClass: 'text-mt-blue-600',
      icon: '🎯',
      color: 'vigia-amber',
    },
    {
      label: 'Câmeras Offline Agora',
      value: formatNumber(kpis.camerasOfflineNow),
      subValue: 'Requer atenção imediata',
      subClass: kpis.camerasOfflineNow > 0 ? 'text-vigia-red-600 font-semibold' : 'text-mt-green-600',
      icon: '⚠️',
      color: 'vigia-red',
      alert: kpis.camerasOfflineNow > 0,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {kpiItems.map((item, index) => (
            <div
              key={index}
              className={`relative p-3 md:p-4 rounded-xl border-2 transition-all duration-300 ${
                item.color === 'mt-blue' ? 'border-mt-blue-200 bg-mt-blue-50' :
                item.color === 'mt-green' ? 'border-mt-green-200 bg-mt-green-50' :
                item.color === 'vigia-amber' ? 'border-vigia-amber-200 bg-vigia-amber-50' :
                'border-vigia-red-200 bg-vigia-red-50'
              } ${item.alert ? 'animate-pulse ring-2 ring-vigia-red-300' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-2xl md:text-3xl" aria-hidden="true">{item.icon}</span>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tabular-nums">
                      {item.value}
                    </p>
                  </div>
                </div>
                <div className="text-right hidden md:block">
                  <p className={`text-sm md:text-base font-medium ${item.subClass}`}>
                    {item.subValue}
                  </p>
                </div>
              </div>
              <div className="mt-2 md:mt-3 text-sm md:text-base font-medium {item.subClass} hidden md:block">
                {item.subValue}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-2 md:mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>Atualizado: {lastFetch ? new Date(lastFetch).toLocaleTimeString('pt-BR') : '—'}</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-mt-green-500 animate-pulse" aria-hidden="true"></span>
            Auto-refresh ativo
          </span>
        </div>
      </div>
    </div>
  );
}