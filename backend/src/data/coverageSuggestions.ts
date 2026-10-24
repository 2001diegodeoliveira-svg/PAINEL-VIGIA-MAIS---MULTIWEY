import type { CoverageSuggestion } from '../types';

export const MOCK_COVERAGE_SUGGESTIONS: CoverageSuggestion[] = [
  {
    municipality: 'Água Boa',
    municipalityCode: '5100102',
    latitude: -14.0508,
    longitude: -52.1625,
    priority: 'high',
    reason: 'Alta incidência de roubos de veículos na BR-158',
    estimatedCameras: 15,
  },
  {
    municipality: 'Alta Floresta',
    municipalityCode: '5100201',
    latitude: -9.8747,
    longitude: -56.0858,
    priority: 'high',
    reason: 'Polo regional sem cobertura de videomonitoramento',
    estimatedCameras: 20,
  },
  {
    municipality: 'Juína',
    municipalityCode: '5103809',
    latitude: -11.3739,
    longitude: -58.7411,
    priority: 'medium',
    reason: 'Crescimento populacional e aumento de ocorrências',
    estimatedCameras: 12,
  },
  {
    municipality: 'Colíder',
    municipalityCode: '5102678',
    latitude: -10.8167,
    longitude: -55.45,
    priority: 'medium',
    reason: 'Eixo logístico da BR-163 sem monitoramento',
    estimatedCameras: 10,
  },
];
