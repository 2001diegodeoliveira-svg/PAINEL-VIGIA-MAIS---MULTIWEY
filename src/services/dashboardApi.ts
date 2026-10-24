import type { DashboardData, Camera, Municipality, KPIData, Action, ActionStats, NetworkHealth, LPRAlert, BeforeAfterData, CoverageSuggestion } from '../types';
import type { FeatureCollection } from 'geojson';

const MOCK_MUNICIPALITIES: Municipality[] = [
  { code: '5103403', name: 'Cuiabá', geometry: { type: 'Polygon', coordinates: [] }, centroid: [-15.5961, -56.0974], status: 'with_vigia', camerasCount: 450, camerasOnline: 435, camerasOffline: 15, actionsCount: 1240, lastOccurrence: '2026-10-23T14:32:00', population: 623614 },
  { code: '5108402', name: 'Várzea Grande', geometry: { type: 'Polygon', coordinates: [] }, centroid: [-15.6467, -56.1333], status: 'with_vigia', camerasCount: 380, camerasOnline: 365, camerasOffline: 15, actionsCount: 890, lastOccurrence: '2026-10-23T13:15:00', population: 292228 },
  { code: '5107008', name: 'Sinop', geometry: { type: 'Polygon', coordinates: [] }, centroid: [-11.8642, -55.5028], status: 'with_vigia', camerasCount: 320, camerasOnline: 310, camerasOffline: 10, actionsCount: 670, lastOccurrence: '2026-10-23T14:32:00', population: 196312 },
  { code: '5107107', name: 'Sorriso', geometry: { type: 'Polygon', coordinates: [] }, centroid: [-12.5428, -55.7153], status: 'with_vigia', camerasCount: 280, camerasOnline: 275, camerasOffline: 5, actionsCount: 540, lastOccurrence: '2026-10-23T12:45:00', population: 94000 },
  { code: '5105507', name: 'Lucas do Rio Verde', geometry: { type: 'Polygon', coordinates: [] }, centroid: [-13.0547, -55.9125], status: 'with_vigia', camerasCount: 250, camerasOnline: 240, camerasOffline: 10, actionsCount: 480, lastOccurrence: '2026-10-23T11:20:00', population: 78000 },
  { code: '5106208', name: 'Rondonópolis', geometry: { type: 'Polygon', coordinates: [] }, centroid: [-16.4708, -54.6356], status: 'with_vigia', camerasCount: 310, camerasOnline: 295, camerasOffline: 15, actionsCount: 720, lastOccurrence: '2026-10-23T10:30:00', population: 237000 },
  { code: '5102702', name: 'Cáceres', geometry: { type: 'Polygon', coordinates: [] }, centroid: [-16.0722, -57.6789], status: 'implementing', camerasCount: 80, camerasOnline: 70, camerasOffline: 10, actionsCount: 120, lastOccurrence: '2026-10-22T18:00:00', population: 94000 },
  { code: '5101209', name: 'Barra do Garças', geometry: { type: 'Polygon', coordinates: [] }, centroid: [-15.8911, -52.2583], status: 'implementing', camerasCount: 60, camerasOnline: 55, camerasOffline: 5, actionsCount: 90, lastOccurrence: '2026-10-22T16:30:00', population: 72000 },
  { code: '5105101', name: 'Tangará da Serra', geometry: { type: 'Polygon', coordinates: [] }, centroid: [-14.6236, -57.4958], status: 'with_vigia', camerasCount: 180, camerasOnline: 170, camerasOffline: 10, actionsCount: 340, lastOccurrence: '2026-10-23T09:15:00', population: 106000 },
  { code: '5105309', name: 'Primavera do Leste', geometry: { type: 'Polygon', coordinates: [] }, centroid: [-15.5608, -54.3069], status: 'with_vigia', camerasCount: 150, camerasOnline: 145, camerasOffline: 5, actionsCount: 280, lastOccurrence: '2026-10-23T08:45:00', population: 68000 },
];

const generateCameras = (): Camera[] => {
  const cameras: Camera[] = [];
  const municipalities = MOCK_MUNICIPALITIES.filter(m => m.status === 'with_vigia' || m.status === 'implementing');
  
  municipalities.forEach(muni => {
    const onlineCount = muni.camerasOnline;
    const offlineCount = muni.camerasOffline;
    const totalCount = muni.camerasCount;
    
    for (let i = 0; i < totalCount; i++) {
      const isOnline = i < onlineCount;
      const isMaintenance = i >= onlineCount && i < onlineCount + Math.min(3, offlineCount);
      cameras.push({
        id: `cam-${muni.code}-${String(i + 1).padStart(4, '0')}`,
        name: `Câmera ${muni.name} ${String(i + 1).padStart(3, '0')}`,
        municipality: muni.name,
        municipalityCode: muni.code,
        latitude: muni.centroid[0] + (Math.random() - 0.5) * 0.1,
        longitude: muni.centroid[1] + (Math.random() - 0.5) * 0.1,
        status: isOnline ? 'online' : (isMaintenance ? 'maintenance' : 'offline'),
        streamUrl: isOnline ? `https://stream.vigiamais.mt.gov.br/cam-${muni.code}-${String(i + 1).padStart(4, '0')}.m3u8` : undefined,
        thumbnailUrl: isOnline ? `https://stream.vigiamais.mt.gov.br/thumb/cam-${muni.code}-${String(i + 1).padStart(4, '0')}.jpg` : undefined,
        lastSeen: isOnline ? new Date(Date.now() - Math.random() * 300000).toISOString() : new Date(Date.now() - Math.random() * 86400000).toISOString(),
        uptime: isOnline ? 95 + Math.random() * 5 : 0,
        type: i < totalCount * 0.1 ? 'lpr' : (i < totalCount * 0.05 ? 'movel' : 'fixa'),
        address: `Rua ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}, ${Math.floor(Math.random() * 999) + 1}`,
        region: muni.name,
      });
    }
  });
  
  return cameras;
};

const MOCK_CAMERAS = generateCameras();

const MOCK_ACTIONS: Action[] = [
  { id: 'act-1', type: 'veiculo_recuperado', typeLabel: 'Veículo Recuperado', municipality: 'Sinop', municipalityCode: '5107008', date: '2026-10-23T14:32:00', description: 'Veículo roubado recuperado na BR-163, identificado por câmera LPR', cameraId: 'cam-5107008-0150', mediaUrl: '/media/act-1.jpg', mediaType: 'image', isHighlight: true },
  { id: 'act-2', type: 'prisao_flagrante', typeLabel: 'Prisão em Flagrante', municipality: 'Cuiabá', municipalityCode: '5103403', date: '2026-10-23T13:45:00', description: 'Suspeito de tráfico preso em flagrante no Centro', cameraId: 'cam-5103403-0234', isHighlight: false },
  { id: 'act-3', type: 'pessoa_localizada', typeLabel: 'Pessoa Localizada', municipality: 'Várzea Grande', municipalityCode: '5108402', date: '2026-10-23T12:15:00', description: 'Idoso desaparecido encontrado por monitoramento', cameraId: 'cam-5108402-0089', isHighlight: false },
  { id: 'act-4', type: 'mandado_cumprido', typeLabel: 'Mandado Cumprido', municipality: 'Rondonópolis', municipalityCode: '5106208', date: '2026-10-23T11:30:00', description: 'Foragido da justiça capturado em operação', cameraId: 'cam-5106208-0112', isHighlight: false },
  { id: 'act-5', type: 'ocorrencia_elucidada', typeLabel: 'Ocorrência Elucidada', municipality: 'Sorriso', municipalityCode: '5107107', date: '2026-10-23T10:20:00', description: 'Roubo a comércio esclarecido com imagens', cameraId: 'cam-5107107-0067', isHighlight: false },
  { id: 'act-6', type: 'veiculo_recuperado', typeLabel: 'Veículo Recuperado', municipality: 'Lucas do Rio Verde', municipalityCode: '5105507', date: '2026-10-23T09:45:00', description: 'Caminhão roubado interceptado na MT-220', cameraId: 'cam-5105507-0045', isHighlight: false },
  { id: 'act-7', type: 'prisao_flagrante', typeLabel: 'Prisão em Flagrante', municipality: 'Tangará da Serra', municipalityCode: '5105101', date: '2026-10-23T08:30:00', description: 'Assalto a posto de combustível - 2 presos', cameraId: 'cam-5105101-0078', isHighlight: false },
  { id: 'act-8', type: 'pessoa_localizada', typeLabel: 'Pessoa Localizada', municipality: 'Primavera do Leste', municipalityCode: '5105309', date: '2026-10-22T20:15:00', description: 'Criança perdida em evento localizada', cameraId: 'cam-5105309-0023', isHighlight: false },
];

const MOCK_ACTION_STATS: ActionStats = {
  byType: {
    veiculo_recuperado: 1240,
    prisao_flagrante: 890,
    pessoa_localizada: 340,
    mandado_cumprido: 210,
    ocorrencia_elucidada: 560,
  },
  monthlyEvolution: [
    { month: 'Jan', count: 280 },
    { month: 'Fev', count: 310 },
    { month: 'Mar', count: 295 },
    { month: 'Abr', count: 340 },
    { month: 'Mai', count: 380 },
    { month: 'Jun', count: 420 },
    { month: 'Jul', count: 450 },
    { month: 'Ago', count: 480 },
    { month: 'Set', count: 510 },
    { month: 'Out', count: 324 },
  ],
  municipalityRanking: [
    { municipality: 'Cuiabá', code: '5103403', count: 1240 },
    { municipality: 'Várzea Grande', code: '5108402', count: 890 },
    { municipality: 'Rondonópolis', code: '5106208', count: 720 },
    { municipality: 'Sinop', code: '5107008', count: 670 },
    { municipality: 'Sorriso', code: '5107107', count: 540 },
    { municipality: 'Lucas do Rio Verde', code: '5105507', count: 480 },
    { municipality: 'Tangará da Serra', code: '5105101', count: 340 },
    { municipality: 'Primavera do Leste', code: '5105309', count: 280 },
    { municipality: 'Cáceres', code: '5102702', count: 120 },
    { municipality: 'Barra do Garças', code: '5101209', count: 90 },
  ],
  highlightedCase: MOCK_ACTIONS[0],
  avgResponseTime: 12.5,
};

const MOCK_NETWORK_HEALTH: NetworkHealth = {
  uptime: 94.5,
  recurringFailures: 23,
  avgRepairTime: 4.2,
  camerasWithIssues: [
    { cameraId: 'cam-5103403-0087', name: 'Câmera Cuiabá 087', municipality: 'Cuiabá', failuresCount: 8 },
    { cameraId: 'cam-5108402-0145', name: 'Câmera Várzea Grande 145', municipality: 'Várzea Grande', failuresCount: 6 },
    { cameraId: 'cam-5107008-0201', name: 'Câmera Sinop 201', municipality: 'Sinop', failuresCount: 5 },
  ],
};

const MOCK_LPR_ALERTS: LPRAlert[] = [
  { id: 'lpr-1', plate: 'ABC-1234', cameraId: 'cam-5103403-0150', cameraName: 'Câmera Cuiabá 150 (LPR)', municipality: 'Cuiabá', timestamp: '2026-10-23T14:28:00', restrictionType: 'stolen', status: 'active' },
  { id: 'lpr-2', plate: 'XYZ-9876', cameraId: 'cam-5107008-0089', cameraName: 'Câmera Sinop 089 (LPR)', municipality: 'Sinop', timestamp: '2026-10-23T13:55:00', restrictionType: 'wanted', status: 'active' },
  { id: 'lpr-3', plate: 'DEF-5555', cameraId: 'cam-5108402-0034', cameraName: 'Câmera Várzea Grande 034 (LPR)', municipality: 'Várzea Grande', timestamp: '2026-10-23T12:10:00', restrictionType: 'traffic', status: 'resolved' },
];

const MOCK_BEFORE_AFTER: BeforeAfterData[] = [
  { municipality: 'Cuiabá', municipalityCode: '5103403', beforeInstallation: { totalOccurrences: 2840, period: '2022' }, afterInstallation: { totalOccurrences: 1920, period: '2024' }, reductionPercent: 32.4 },
  { municipality: 'Várzea Grande', municipalityCode: '5108402', beforeInstallation: { totalOccurrences: 1980, period: '2022' }, afterInstallation: { totalOccurrences: 1420, period: '2024' }, reductionPercent: 28.3 },
  { municipality: 'Sinop', municipalityCode: '5107008', beforeInstallation: { totalOccurrences: 1560, period: '2022' }, afterInstallation: { totalOccurrences: 980, period: '2024' }, reductionPercent: 37.2 },
  { municipality: 'Rondonópolis', municipalityCode: '5106208', beforeInstallation: { totalOccurrences: 1340, period: '2022' }, afterInstallation: { totalOccurrences: 920, period: '2024' }, reductionPercent: 31.3 },
  { municipality: 'Sorriso', municipalityCode: '5107107', beforeInstallation: { totalOccurrences: 890, period: '2022' }, afterInstallation: { totalOccurrences: 540, period: '2024' }, reductionPercent: 39.3 },
];

const MOCK_COVERAGE_SUGGESTIONS: CoverageSuggestion[] = [
  { municipality: 'Água Boa', municipalityCode: '5100102', latitude: -14.0508, longitude: -52.1625, priority: 'high', reason: 'Alta incidência de roubos de veículos na BR-158', estimatedCameras: 15 },
  { municipality: 'Alta Floresta', municipalityCode: '5100201', latitude: -9.8747, longitude: -56.0858, priority: 'high', reason: 'Polo regional sem cobertura de videomonitoramento', estimatedCameras: 20 },
  { municipality: 'Juína', municipalityCode: '5103809', latitude: -11.3739, longitude: -58.7411, priority: 'medium', reason: 'Crescimento populacional e aumento de ocorrências', estimatedCameras: 12 },
  { municipality: 'Colíder', municipalityCode: '5102678', latitude: -10.8167, longitude: -55.45, priority: 'medium', reason: 'Eixo logístico da BR-163 sem monitoramento', estimatedCameras: 10 },
];

export class DashboardApiService {
  private baseUrl: string;
  private useMock: boolean;

  constructor(
    baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000/api',
    useMock = (import.meta.env.VITE_USE_MOCK_DATA as string) === 'true',
  ) {
    this.baseUrl = baseUrl;
    this.useMock = useMock;
  }

  async fetchDashboardData(): Promise<DashboardData> {
    if (this.useMock) {
      return this.getMockData();
    }

    try {
      const response = await fetch(`${this.baseUrl}/dashboard`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('API unavailable, falling back to mock data:', error);
      return this.getMockData();
    }
  }

  async fetchCameras(): Promise<Camera[]> {
    if (this.useMock) return MOCK_CAMERAS;
    const response = await fetch(`${this.baseUrl}/cameras`);
    return response.json();
  }

  async fetchMunicipalities(): Promise<Municipality[]> {
    if (this.useMock) return MOCK_MUNICIPALITIES;
    const response = await fetch(`${this.baseUrl}/municipalities`);
    return response.json();
  }

  async fetchKPIs(): Promise<KPIData> {
    if (this.useMock) return this.getMockData().kpis;
    const response = await fetch(`${this.baseUrl}/kpis`);
    return response.json();
  }

  async fetchActions(): Promise<Action[]> {
    if (this.useMock) return MOCK_ACTIONS;
    const response = await fetch(`${this.baseUrl}/actions`);
    return response.json();
  }

  async fetchActionStats(): Promise<ActionStats> {
    if (this.useMock) return MOCK_ACTION_STATS;
    const response = await fetch(`${this.baseUrl}/actions/stats`);
    return response.json();
  }

  async fetchNetworkHealth(): Promise<NetworkHealth> {
    if (this.useMock) return MOCK_NETWORK_HEALTH;
    const response = await fetch(`${this.baseUrl}/network/health`);
    return response.json();
  }

  async fetchLPRAlerts(): Promise<LPRAlert[]> {
    if (this.useMock) return MOCK_LPR_ALERTS;
    const response = await fetch(`${this.baseUrl}/lpr/alerts`);
    return response.json();
  }

  async fetchBeforeAfter(): Promise<BeforeAfterData[]> {
    if (this.useMock) return MOCK_BEFORE_AFTER;
    const response = await fetch(`${this.baseUrl}/analytics/before-after`);
    return response.json();
  }

  async fetchCoverageSuggestions(): Promise<CoverageSuggestion[]> {
    if (this.useMock) return MOCK_COVERAGE_SUGGESTIONS;
    const response = await fetch(`${this.baseUrl}/analytics/coverage-suggestions`);
    return response.json();
  }

  async fetchMunicipalityGeoJSON(): Promise<FeatureCollection> {
    if (this.useMock) {
      return {
        type: 'FeatureCollection',
        features: MOCK_MUNICIPALITIES.map(m => ({
          type: 'Feature',
          properties: {
            code: m.code,
            name: m.name,
            status: m.status,
            camerasCount: m.camerasCount,
            camerasOnline: m.camerasOnline,
            camerasOffline: m.camerasOffline,
            actionsCount: m.actionsCount,
          },
          geometry: m.geometry,
        })),
      };
    }
    const response = await fetch(`${this.baseUrl}/geojson/municipalities`);
    return response.json();
  }

  private getMockData(): DashboardData {
    const camerasTotal = MOCK_CAMERAS.length;
    const camerasOnline = MOCK_CAMERAS.filter(c => c.status === 'online').length;
    const camerasOffline = MOCK_CAMERAS.filter(c => c.status === 'offline').length;
    const municipalitiesWithVigia = MOCK_MUNICIPALITIES.filter(m => m.status === 'with_vigia' || m.status === 'implementing').length;

    return {
      kpis: {
        camerasActive: camerasOnline,
        camerasTotal,
        camerasAvailability: Math.round((camerasOnline / camerasTotal) * 1000) / 10,
        municipalitiesAttended: municipalitiesWithVigia,
        municipalitiesTotal: 141,
        actionsMonth: MOCK_ACTION_STATS.monthlyEvolution[MOCK_ACTION_STATS.monthlyEvolution.length - 1].count,
        actionsYear: MOCK_ACTION_STATS.monthlyEvolution.reduce((sum, m) => sum + m.count, 0),
        camerasOfflineNow: camerasOffline,
      },
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

  setUseMock(useMock: boolean) {
    this.useMock = useMock;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
}

export const dashboardApi = new DashboardApiService();