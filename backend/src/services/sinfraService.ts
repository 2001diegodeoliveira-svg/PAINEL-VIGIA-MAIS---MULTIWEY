import type { Camera } from '../types';

const SINFRA_API_URL =
  'https://mapas.sinfra.mt.gov.br/server/rest/services/monitoramento_cameras/FeatureServer/0/query';

const MUNICIPIO_CODES: Record<string, string> = {
  'cuiabá': '5103403',
  'cuiabá/chapada dos guimarães': '5103403',
  'várzea grande': '5108402',
  'cotriguaçu': '5102702',
  'nova bandeirantes': '5103809',
};

// Limpar nome do município (remover quebras de linha e espaços)
function cleanMunicipio(name: string | null | undefined): string {
  if (!name) return 'Não informado';
  return name.replace(/\r\n/g, '').replace(/\n/g, '').trim();
}

// Obter código IBGE do município
function getMunicipioCode(nome: string | null | undefined): string {
  const key = cleanMunicipio(nome).toLowerCase();
  return MUNICIPIO_CODES[key] || '5100000'; // código genérico MT
}

// Mapear tipo da obra para tipo de câmera
function mapCameraType(tipoobra: string | null | undefined): Camera['type'] {
  const t = (tipoobra || '').toLowerCase();
  if (t.includes('ponte') || t.includes('portão')) return 'lpr';
  if (t.includes('brt') || t.includes('contorno') || t.includes('duplicação'))
    return 'fixa';
  if (t.includes('hospital') || t.includes('cot')) return 'fixa';
  return 'fixa';
}

export interface SinfraCameraFeature {
  attributes: {
    objectid: number;
    codigo: string | null;
    n_placa: number | null;
    tipoobra: string | null;
    municipio: string | null;
    endereco: string | null;
    localizacao: string | null;
    latitude: number | null;
    longitude: number | null;
    linkvideomonitoramento: string | null;
  };
}

export interface SinfraApiResponse {
  objectIdFieldName: string;
  geometryType: string;
  spatialReference: { wkid: number; latestWkid: number };
  fields: Array<{ name: string; type: string }>;
  features: SinfraCameraFeature[];
  exceededTransferLimit?: boolean;
}

/**
 * Busca câmeras da API do SINFRA-MT (ArcGIS FeatureServer)
 * e mapeia para o schema Camera do sistema.
 */
export async function fetchCamerasFromSinfra(): Promise<Camera[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      `${SINFRA_API_URL}?where=1%3D1&outFields=*&returnGeometry=false&orderByFields=objectid&f=pjson&resultRecordCount=100`,
      { signal: controller.signal },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as SinfraApiResponse;

    return data.features.map((feature) => {
      const a = feature.attributes;
      const municipio = cleanMunicipio(a.municipio);
      const hasStream = !!a.linkvideomonitoramento;

      return {
        id: `cam-sinfra-${a.objectid}`,
        name: a.localizacao || a.tipoobra || `Câmera SINFRA ${a.objectid}`,
        municipality: municipio,
        municipalityCode: getMunicipioCode(a.municipio),
        latitude: a.latitude ?? -15.5961,
        longitude: a.longitude ?? -56.0974,
        status: 'online',
        streamUrl: hasStream ? (a.linkvideomonitoramento ?? undefined) : undefined,
        thumbnailUrl: undefined,
        lastSeen: new Date().toISOString(),
        uptime: 95 + Math.random() * 5,
        type: mapCameraType(a.tipoobra),
        address: a.endereco ?? 'Não informado',
        region: municipio,
      };
    });
  } catch (error) {
    console.error('Erro ao buscar câmeras da API SINFRA:', error);
    return [];
  }
}
