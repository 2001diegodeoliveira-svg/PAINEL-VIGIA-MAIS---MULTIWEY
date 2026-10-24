import { useState, useEffect, useRef, useCallback } from 'react';
import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';
import { formatTime, getActionTypeIcon, getActionTypeColor } from '../utils/formatters';
import type { Action } from '../types';
import { Car, BadgeAlert, User, ClipboardCheck, Search, Play, Pause } from 'lucide-react';

const ACTION_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  veiculo_recuperado: Car,
  prisao_flagrante: BadgeAlert,
  pessoa_localizada: User,
  mandado_cumprido: ClipboardCheck,
  ocorrencia_elucidada: Search,
};

export function TimelineFooter() {
  const { actions, actionStats } = useDataStore();
  const { highlightedAction, setHighlightedAction } = useAppStore();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const allActions = [...actions];
  if (actionStats?.highlightedCase && !actions.find((a: Action) => a.id === actionStats.highlightedCase!.id)) {
    allActions.unshift(actionStats.highlightedCase);
  }

  const animateScroll = useCallback(() => {
    if (!containerRef.current || isPaused) return;

    const container = containerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (maxScroll <= 0) return;

    setScrollPosition((prev) => {
      const next = prev + 0.5;
      if (next >= maxScroll) {
        container.scrollLeft = 0;
        return 0;
      }
      container.scrollLeft = next;
      return next;
    });

    animationRef.current = requestAnimationFrame(animateScroll);
  }, [isPaused]);

  useEffect(() => {
    const frame = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(frame);
  }, [animateScroll]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const actionTypeColors: Record<string, string> = {
    veiculo_recuperado: 'border-l-4 border-blue-500 bg-blue-50',
    prisao_flagrante: 'border-l-4 border-red-500 bg-red-50',
    pessoa_localizada: 'border-l-4 border-green-500 bg-green-50',
    mandado_cumprido: 'border-l-4 border-purple-500 bg-purple-50',
    ocorrencia_elucidada: 'border-l-4 border-amber-500 bg-amber-50',
  };

  const renderActionItem = (action: Action) => {
    const Icon = ACTION_ICONS[action.type];
    return (
      <div
        key={action.id}
        className={`flex-shrink-0 px-4 md:px-6 py-3 ${actionTypeColors[action.type] || 'border-l-4 border-gray-500 bg-gray-50'} min-w-[350px] md:min-w-[450px] border-t border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group`}
        onClick={() => setHighlightedAction(action.isHighlight ? action : (action.id === highlightedAction?.id ? null : action))}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setHighlightedAction(action.isHighlight ? action : (action.id === highlightedAction?.id ? null : action)); } }}
      >
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2 mt-0.5">
            <Icon size={20} strokeWidth={2} />
            {action.isHighlight && (
              <span className="flex items-center px-2 py-1 text-xs font-medium bg-vigia-amber-100 text-vigia-amber-800 rounded animate-pulse ml-1">
                ⭐ DESTAQUE
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getActionTypeColor(action.type)}`}>
                {action.typeLabel}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">{formatTime(action.date)}</span>
            </div>
            <p className="text-sm font-medium text-gray-900 truncate">{action.description}</p>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <span className="text-[12px]">📍</span> {action.municipality}
              {action.cameraId && <span className="ml-2">📷 {action.cameraId}</span>}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const latestMonthCount = actionStats?.monthlyEvolution[actionStats.monthlyEvolution.length - 1]?.count || 0;

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="flex items-center justify-between px-4 md:px-6 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-gray-900">Linha do Tempo de Ações</h3>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-mt-green-100 text-mt-green-800 border border-mt-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-mt-green-500 animate-pulse" />
            Ao vivo
          </span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50"
            aria-label={isPaused ? 'Retomar rolagem' : 'Pausar rolagem'}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Total: <span className="font-semibold text-gray-900">{actions.length}</span> ações recentes</span>
          <span className="hidden md:inline">|</span>
          <span>Mês: <span className="font-semibold text-mt-blue-600">{latestMonthCount}</span></span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="overflow-hidden relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="region"
        aria-label="Feed de ações recentes"
      >
        <div
          className="flex whitespace-nowrap transition-transform duration-300 ease-linear"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {allActions.map((action) => renderActionItem(action))}
          {allActions.map((action) => renderActionItem({ ...action, id: `${action.id}-clone` }))}
        </div>
      </div>

      {highlightedAction && (
        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:bottom-24 md:w-96 z-50 animate-slide-up">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 max-h-80 overflow-y-auto">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: getActionTypeColor(highlightedAction.type).replace('bg-', 'bg-opacity-20').replace('border-', 'border-opacity-20') }}>
                  {getActionTypeIcon(highlightedAction.type)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{highlightedAction.typeLabel}</p>
                  <p className="text-sm text-gray-500">{highlightedAction.municipality} • {formatTime(highlightedAction.date)}</p>
                </div>
              </div>
              <button
                onClick={() => setHighlightedAction(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fechar detalhes"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-700 mb-3">{highlightedAction.description}</p>
            {highlightedAction.mediaUrl && (
              <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
                {highlightedAction.mediaType === 'video' ? (
                  <video src={highlightedAction.mediaUrl} controls className="w-full" muted />
                ) : (
                  <img src={highlightedAction.mediaUrl} alt="" className="w-full" />
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-gray-500 uppercase">Câmera</p>
                <p className="font-medium">{highlightedAction.cameraId || '—'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-gray-500 uppercase">Município</p>
                <p className="font-medium">{highlightedAction.municipality}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
