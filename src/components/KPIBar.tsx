import { useDataStore } from '../stores/dataStore';
import { formatNumber, formatPercent } from '../utils/formatters';

export function KPIBar() {
  const { kpis, isLoading, lastFetch } = useDataStore();

  if (isLoading && !kpis) {
    return (
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-20 md:h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!kpis) return null;

  const availabilityClass =
    kpis.camerasAvailability >= 95
      ? 'text-mt-green-600 bg-mt-green-50 border-mt-green-100'
      : kpis.camerasAvailability >= 85
      ? 'text-vigia-amber-600 bg-vigia-amber-50 border-vigia-amber-100'
      : 'text-vigia-red-600 bg-vigia-red-50 border-vigia-red-100';

  const kpiItems = [
    {
      label: 'Câmeras Ativas / Total',
      value: `${formatNumber(kpis.camerasActive)} / ${formatNumber(kpis.camerasTotal)}`,
      subValue: `${formatPercent(kpis.camerasAvailability)} disponibilidade`,
      subClass: availabilityClass,
      icon: '📷',
      color: 'mt-blue',
      gradient: 'from-mt-blue-500 to-mt-blue-600',
    },
    {
      label: 'Municípios Atendidos',
      value: `${kpis.municipalitiesAttended} de ${kpis.municipalitiesTotal}`,
      subValue: `${formatPercent(
        (kpis.municipalitiesAttended / kpis.municipalitiesTotal) * 100,
      )} cobertura`,
      subClass: 'text-mt-green-600 bg-mt-green-50 border-mt-green-100',
      icon: '🏙️',
      color: 'mt-green',
      gradient: 'from-mt-green-500 to-mt-green-600',
    },
    {
      label: 'Ações no Mês / Ano',
      value: `${formatNumber(kpis.actionsMonth)} / ${formatNumber(kpis.actionsYear)}`,
      subValue: 'Mês atual / Acumulado',
      subClass: 'text-mt-blue-600 bg-mt-blue-50 border-mt-blue-100',
      icon: '🎯',
      color: 'vigia-amber',
      gradient: 'from-vigia-amber-500 to-vigia-amber-600',
    },
    {
      label: 'Câmeras Offline Agora',
      value: formatNumber(kpis.camerasOfflineNow),
      subValue: 'Requer atenção imediata',
      subClass:
        kpis.camerasOfflineNow > 0
          ? 'text-vigia-red-600 font-semibold bg-vigia-red-50 border-vigia-red-100'
          : 'text-mt-green-600 bg-mt-green-50 border-mt-green-100',
      icon: '⚠️',
      color: 'vigia-red',
      alert: kpis.camerasOfflineNow > 0,
      gradient: 'from-vigia-red-500 to-vigia-red-600',
    },
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-full mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpiItems.map((item, index) => (
            <div
              key={index}
              className={`relative p-3 rounded-xl border transition-all duration-300 ${
                item.alert
                  ? 'animate-pulse ring-2 ring-vigia-red-300 border-vigia-red-200 bg-vigia-red-50'
                  : `border-${item.color}-100 bg-${item.color}-50`
              }`}
            >
              <div className="absolute top-3 right-3">
                <span className="text-2xl" aria-hidden="true">{item.icon}</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 tabular-nums leading-tight">
                    {item.value}
                  </p>
                  <p className={`text-xs font-medium mt-1 ${item.subClass}`}>
                    {item.subValue}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center opacity-60">
                  <span className="text-[10px]">{item.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] md:text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-mt-green-500 animate-pulse" />
            Atualizado{' '}
            {lastFetch
              ? new Date(lastFetch).toLocaleTimeString('pt-BR')
              : '—'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-mt-green-500 animate-pulse" />
            Auto-refresh ativo
          </span>
        </div>
      </div>
    </div>
  );
}
