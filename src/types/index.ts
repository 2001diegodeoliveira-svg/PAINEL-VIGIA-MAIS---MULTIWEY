import type { Polygon, MultiPolygon } from 'geojson';

export interface Camera {
  id: string;
  name: string;
  municipality: string;
  municipalityCode: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline' | 'maintenance';
  streamUrl?: string;
  thumbnailUrl?: string;
  lastSeen: string;
  uptime: number;
  type: 'fixa' | 'movel' | 'lpr';
  address: string;
  region: string;
}

export interface Municipality {
  code: string;
  name: string;
  geometry: Polygon | MultiPolygon;
  centroid: [number, number];
  status: 'with_vigia' | 'implementing' | 'no_coverage';
  camerasCount: number;
  camerasOnline: number;
  camerasOffline: number;
  actionsCount: number;
  lastOccurrence?: string;
  population?: number;
}

export interface KPIData {
  camerasActive: number;
  camerasTotal: number;
  camerasAvailability: number;
  municipalitiesAttended: number;
  municipalitiesTotal: number;
  actionsMonth: number;
  actionsYear: number;
  camerasOfflineNow: number;
}

export interface Action {
  id: string;
  type: 'veiculo_recuperado' | 'prisao_flagrante' | 'pessoa_localizada' | 'mandado_cumprido' | 'ocorrencia_elucidada';
  typeLabel: string;
  municipality: string;
  municipalityCode: string;
  date: string;
  description: string;
  cameraId?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  isHighlight: boolean;
}

export interface ActionStats {
  byType: Record<string, number>;
  monthlyEvolution: Array<{ month: string; count: number }>;
  municipalityRanking: Array<{ municipality: string; code: string; count: number }>;
  highlightedCase?: Action;
  avgResponseTime: number;
}

export interface NetworkHealth {
  uptime: number;
  recurringFailures: number;
  avgRepairTime: number;
  camerasWithIssues: Array<{ cameraId: string; name: string; municipality: string; failuresCount: number }>;
}

export interface LPRAlert {
  id: string;
  plate: string;
  cameraId: string;
  cameraName: string;
  municipality: string;
  timestamp: string;
  restrictionType: 'stolen' | 'wanted' | 'traffic' | 'other';
  status: 'active' | 'resolved';
}

export interface BeforeAfterData {
  municipality: string;
  municipalityCode: string;
  beforeInstallation: { totalOccurrences: number; period: string };
  afterInstallation: { totalOccurrences: number; period: string };
  reductionPercent: number;
}

export interface CoverageSuggestion {
  municipality: string;
  municipalityCode: string;
  latitude: number;
  longitude: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  estimatedCameras: number;
}

export interface DashboardData {
  kpis: KPIData;
  municipalities: Municipality[];
  cameras: Camera[];
  actions: Action[];
  actionStats: ActionStats;
  networkHealth: NetworkHealth;
  lprAlerts: LPRAlert[];
  beforeAfter: BeforeAfterData[];
  coverageSuggestions: CoverageSuggestion[];
  lastUpdated: string;
}

export type ViewMode = 'public' | 'internal';
export type ScreenMode = 'dashboard' | 'map' | 'actions' | 'ranking' | 'presentation';

export interface AppState {
  viewMode: ViewMode;
  screenMode: ScreenMode;
  selectedMunicipality: string | null;
  selectedCamera: string | null;
  highlightedAction: Action | null;
  isPresentationMode: boolean;
  presentationCurrentScreen: number;
  filters: {
    region: string;
    period: string;
    actionType: string;
  };
}