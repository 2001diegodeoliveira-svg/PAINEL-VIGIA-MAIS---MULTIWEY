import type { DashboardData, KPIData } from '../types';
import { MOCK_MUNICIPALITIES } from './municipalities';
import { MOCK_CAMERAS } from './cameras';
import { MOCK_ACTIONS } from './actions';
import { MOCK_ACTION_STATS } from './actionStats';
import { MOCK_NETWORK_HEALTH } from './networkHealth';
import { MOCK_LPR_ALERTS } from './lprAlerts';
import { MOCK_BEFORE_AFTER } from './beforeAfter';
import { MOCK_COVERAGE_SUGGESTIONS } from './coverageSuggestions';

export function getMockDashboardData(): DashboardData {
  const camerasTotal = MOCK_CAMERAS.length;
  const camerasOnline = MOCK_CAMERAS.filter((c) => c.status === 'online').length;
  const camerasOffline = MOCK_CAMERAS.filter((c) => c.status === 'offline').length;
  const municipalitiesWithVigia = MOCK_MUNICIPALITIES.filter(
    (m) => m.status === 'with_vigia' || m.status === 'implementing',
  ).length;

  const kpis: KPIData = {
    camerasActive: camerasOnline,
    camerasTotal,
    camerasAvailability: Math.round((camerasOnline / camerasTotal) * 1000) / 10,
    municipalitiesAttended: municipalitiesWithVigia,
    municipalitiesTotal: 141,
    actionsMonth:
      MOCK_ACTION_STATS.monthlyEvolution[
        MOCK_ACTION_STATS.monthlyEvolution.length - 1
      ].count,
    actionsYear: MOCK_ACTION_STATS.monthlyEvolution.reduce(
      (sum, m) => sum + m.count,
      0,
    ),
    camerasOfflineNow: camerasOffline,
  };

  return {
    kpis,
    municipalities: MOCK_MUNICIPALITIES,
    cameras: MOCK_CAMERAS,
    actions: MOCK_ACTIONS,
    actionStats: MOCK_ACTION_STATS,
    networkHealth: MOCK_NETWORK_HEALTH,
    lprAlerts: MOCK_LPR_ALERTS,
    beforeAfter: MOCK_BEFORE_AFTER,
    coverageSuggestions: MOCK_COVERAGE_SUGGESTIONS,
    lastUpdated: new Date().toISOString(),
  };
}

export {
  MOCK_MUNICIPALITIES,
  MOCK_CAMERAS,
  MOCK_ACTIONS,
  MOCK_ACTION_STATS,
  MOCK_NETWORK_HEALTH,
  MOCK_LPR_ALERTS,
  MOCK_BEFORE_AFTER,
  MOCK_COVERAGE_SUGGESTIONS,
};
