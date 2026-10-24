import type {
  DashboardData,
  Camera,
  Municipality,
  Action,
  KPIData,
  PaginationQuery,
  PaginatedResponse,
} from '../types';
import { getMockDashboardData } from '../data';
import { fetchCamerasFromSinfra } from './sinfraService';

export class DashboardService {
  private data: DashboardData;
  private sinfraCameras: Camera[] = [];
  private sinfraLoaded = false;

  constructor() {
    this.data = getMockDashboardData();
    this.loadSinfraCameras();
  }

  private async loadSinfraCameras(): Promise<void> {
    try {
      this.sinfraCameras = await fetchCamerasFromSinfra();
      this.sinfraLoaded = true;
      console.log(
        `[DashboardService] ${this.sinfraCameras.length} câmeras carregadas da API SINFRA`,
      );
    } catch (error) {
      console.error(
        '[DashboardService] Falha ao carregar câmeras SINFRA:',
        error,
      );
      this.sinfraCameras = [];
    }
  }

  private getAllCameras(): Camera[] {
    return [...this.data.cameras, ...this.sinfraCameras];
  }

  getDashboardData(): DashboardData {
    const allCameras = this.getAllCameras();
    const camerasOnline = allCameras.filter(
      (c) => c.status === 'online',
    ).length;
    const camerasOffline = allCameras.filter(
      (c) => c.status === 'offline',
    ).length;

    const kpis: KPIData = {
      ...this.data.kpis,
      camerasActive: camerasOnline,
      camerasTotal: allCameras.length,
      camerasAvailability: Math.round(
        (camerasOnline / allCameras.length) * 1000,
      ) / 10,
      camerasOfflineNow: camerasOffline,
    };

    return {
      ...this.data,
      kpis,
      cameras: allCameras,
      lastUpdated: new Date().toISOString(),
    };
  }

  getCameras(query: PaginationQuery): PaginatedResponse<Camera> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 50));
    const start = (page - 1) * limit;
    const end = start + limit;
    const allCameras = this.getAllCameras();
    const data = allCameras.slice(start, end);

    return {
      data,
      total: allCameras.length,
      page,
      limit,
      totalPages: Math.ceil(allCameras.length / limit),
    };
  }

  getCameraById(id: string): Camera | undefined {
    return this.getAllCameras().find((c) => c.id === id);
  }

  getCamerasByMunicipality(municipalityCode: string): Camera[] {
    return this.getAllCameras().filter(
      (c) => c.municipalityCode === municipalityCode,
    );
  }

  getMunicipalities(): Municipality[] {
    return this.data.municipalities;
  }

  getMunicipalityByCode(code: string): Municipality | undefined {
    return this.data.municipalities.find((m) => m.code === code);
  }

  getKPIs(): KPIData {
    const allCameras = this.getAllCameras();
    const camerasOnline = allCameras.filter(
      (c) => c.status === 'online',
    ).length;
    const camerasOffline = allCameras.filter(
      (c) => c.status === 'offline',
    ).length;

    return {
      ...this.data.kpis,
      camerasActive: camerasOnline,
      camerasTotal: allCameras.length,
      camerasAvailability: Math.round(
        (camerasOnline / allCameras.length) * 1000,
      ) / 10,
      camerasOfflineNow: camerasOffline,
    };
  }

  getActions(query: PaginationQuery): PaginatedResponse<Action> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 50));
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = this.data.actions.slice(start, end);

    return {
      data,
      total: this.data.actions.length,
      page,
      limit,
      totalPages: Math.ceil(this.data.actions.length / limit),
    };
  }

  getActionStats() {
    return this.data.actionStats;
  }

  getNetworkHealth() {
    return this.data.networkHealth;
  }

  getLPRAlerts() {
    return this.data.lprAlerts;
  }

  getBeforeAfter() {
    return this.data.beforeAfter;
  }

  getCoverageSuggestions() {
    return this.data.coverageSuggestions;
  }

  getMunicipalityGeoJSON() {
    return {
      type: 'FeatureCollection',
      features: this.data.municipalities.map((m) => ({
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

  async refreshSinfraCameras(): Promise<void> {
    await this.loadSinfraCameras();
  }

  isSinfraLoaded(): boolean {
    return this.sinfraLoaded;
  }

  getSinfraCameraCount(): number {
    return this.sinfraCameras.length;
  }
}

export const dashboardService = new DashboardService();
