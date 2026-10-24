import { useDataStore } from '../stores/dataStore';
import { formatNumber, formatPercent } from '../utils/formatters';
import {
  Camera,
  Building2,
  Target,
  AlertTriangle,
  Activity,
  Users,
  ShieldAlert,
} from 'lucide-react';

const KPI_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  camera: Camera,
  building: Building2,
  target: Target,
  alert: AlertTriangle,
  activity: Activity,
  users: Users,
  shield: ShieldAlert,
};

interface KPIItem {
  label: string;
  value: string;
  subValue: string;
  subClass: string;
  iconKey: string;
  color: string;
  alert?: boolean;
  animate?: boolean;
}

export function KPIBar() {
  const { kpis, isLoading, lastFetch } = useDataStore();

  if (isLoading && !kpis) {
    return (
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="card-loading h-20 md:h-24"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!kpis) return null;

  const availabilityClass =
    kpis.camerasAvailability >= 95
      ? 'text-green-600 bg-green-50 border-green-100'
      : kpis.camerasAvailability >= 85
      ? 'text-amber-600 bg-amber-50 border-amber-100'
      : 'text-red-600 bg-red-50 border-red-100';

  const kpiItems: KPIItem[] = [
    {
      label: 'Câmeras Ativas',
      value: `${formatNumber(kpis.camerasActive)}`,
      subValue: `${formatPercent(kpis.camerasAvailability)} disponibilidade`,
      subClass: availabilityClass,
      iconKey: 'camera',
      color: 'blue',
      alert: kpis.camerasOfflineNow > 0,
      animate: true,
    },
    {
      label: 'Municípios Atendidos',
      value: `${kpis.municipalitiesAttended} de ${kpis.municipalitiesTotal}`,
      subValue: `${formatPercent(
        (kpis.municipalitiesAttended / kpis.municipalitiesTotal) * 100,
      )} cobertura`,
      subClass: 'text-blue-600 bg-blue-50 border-blue-100',
      iconKey: 'building',
      color: 'blue',
      animate: true,
    },
    {
      label: 'Ações no Mês',
      value: `${formatNumber(kpis.actionsMonth)}`,
      subValue: 'Mês atual',
      subClass: 'text-blue-600 bg-blue-50 border-blue-100',
      iconKey: 'activity',
      color: 'blue',
      animate: true,
    },
    {
      label: 'Câmeras Offline',
      value: formatNumber(kpis.camerasOfflineNow),
      subValue: 'Requer atenção',
      subClass:
        kpis.camerasOfflineNow > 0
          ? 'text-red-600 font-bold bg-red-50 border-red-100 animate-pulse-fast'
          : 'text-green-600 bg-green-50 border-green-100',
      iconKey: 'shield',
      color: 'red',
      alert: kpis.camerasOfflineNow > 0,
      animate: kpis.camerasOfflineNow > 0,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-full mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpiItems.map((item, index) => {
            const Icon = KPI_ICONS[item.iconKey];
            const isAlert = item.alert && item.animate;
            return (
              <div
                key={index}
                className={`relative p-4 rounded-2xl border transition-all duration-300 hover:shadow-blue hover:-translate-y-1 ${
                  item.alert
                    ? 'bg-red-50 border-red-200 ring-1 ring-red-300 animate-shake'
                    : `border-${item.color}-200 bg-${item.color}-50`
                } group`}
              >
                {/* Ícone animado no canto superior direito */}
                <div
                  className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    isAlert
                      ? 'bg-red-100 text-red-600 border border-red-200 icon-bounce'
                      : `bg-${item.color}-100 text-${item.color}-600 border border-${item.color}-200 icon-glow`
                  }`}
                >
                  <Icon size={16} strokeWidth={2} />
                </div>

                <div className="flex items-start justify-between">
                  <div className="card-loaded">
                    <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      {item.label}
                    </p>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900 tabular-nums leading-tight">
                      {item.value}
                    </p>
                    <p className={`text-xs font-medium mt-2 ${item.subClass}`}>
                      {item.subValue}
                    </p>
                  </div>

                  {/* Ícone secundário animado */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center opacity-80 transition-all duration-300 group-hover:opacity-100 ${
                      item.alert
                        ? 'bg-red-200 text-red-600 icon-wiggle'
                        : `bg-${item.color}-200 text-${item.color}-600 icon-float`
                    }`}
                  >
                    <Icon size={14} strokeWidth={2} />
                  </div>
                </div>

                {/* Barra de progresso sutil para disponibilidade */}
                {item.iconKey === 'camera' && (
                  <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-blue-600 rounded-full transition-all duration-1000 ${
                        kpis.camerasAvailability >= 95
                          ? 'bg-green-500'
                          : kpis.camerasAvailability >= 85
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${kpis.camerasAvailability}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between text-[10px] md:text-xs text-gray-500">
          <span className="flex items-center gap-2 animate-pulse-slow">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-medium">Sistema Online</span>
          </span>
          <span className="flex items-center gap-2 animate-pulse-slow">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-medium">
              Atualizado:{' '}
              {lastFetch
                ? new Date(lastFetch).toLocaleTimeString('pt-BR')
                : '—'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

