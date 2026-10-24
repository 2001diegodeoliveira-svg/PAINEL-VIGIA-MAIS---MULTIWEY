export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.', ',') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.', ',') + 'K';
  }
  return num.toLocaleString('pt-BR');
}

export function formatPercent(value: number, decimals = 1): string {
  return value.toFixed(decimals).replace('.', ',') + '%';
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora mesmo';
  if (diffMins < 60) return `há ${diffMins}min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  return `há ${diffDays}d`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'online':
    case 'with_vigia':
      return 'text-mt-green-600 bg-mt-green-50 border-mt-green-200';
    case 'offline':
    case 'no_coverage':
      return 'text-vigia-red-600 bg-vigia-red-50 border-vigia-red-200';
    case 'maintenance':
    case 'implementing':
      return 'text-vigia-amber-600 bg-vigia-amber-50 border-vigia-amber-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'online': return 'Online';
    case 'offline': return 'Offline';
    case 'maintenance': return 'Manutenção';
    case 'with_vigia': return 'Com Vigia Mais';
    case 'implementing': return 'Em Implantação';
    case 'no_coverage': return 'Sem Cobertura';
    default: return status;
  }
}

export function getActionTypeColor(type: string): string {
  switch (type) {
    case 'veiculo_recuperado': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'prisao_flagrante': return 'bg-red-100 text-red-800 border-red-200';
    case 'pessoa_localizada': return 'bg-green-100 text-green-800 border-green-200';
    case 'mandado_cumprido': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'ocorrencia_elucidada': return 'bg-amber-100 text-amber-800 border-amber-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getActionTypeIcon(type: string): string {
  switch (type) {
    case 'veiculo_recuperado': return '🚗';
    case 'prisao_flagrante': return '🚔';
    case 'pessoa_localizada': return '👤';
    case 'mandado_cumprido': return '📋';
    case 'ocorrencia_elucidada': return '🔍';
    default: return '📍';
  }
}

export function getLPRRestrictionColor(type: string): string {
  switch (type) {
    case 'stolen': return 'bg-red-100 text-red-800';
    case 'wanted': return 'bg-orange-100 text-orange-800';
    case 'traffic': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}