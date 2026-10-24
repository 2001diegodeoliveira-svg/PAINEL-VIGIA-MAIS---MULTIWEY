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

export class DashboardService {
  private data: DashboardData;

  constructor() {
    this.data = getMockDashboardData();
  }

  getDashboardData(): DashboardData {
    return {
      ...this.data,
      lastUpdated: new Date().toISOString(),
    };
  }

  getCameras(query: PaginationQuery): PaginatedResponse<Camera> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 50));
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = this.data.cameras.slice(start, end);

    return {
      data,
      total: this.data.cameras.length,
      page,
      limit,
      totalPages: Math.ceil(this.data.cameras.length / limit),
    };
  }

  getCameraById(id: string): Camera | undefined {
    return this.data.cameras.find((c) => c.id === id);
  }

  getCamerasByMunicipality(municipalityCode: string): Camera[] {
    return this.data.cameras.filter(
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
    return this.data.kpis;
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
}

export const dashboardService = new DashboardService();
