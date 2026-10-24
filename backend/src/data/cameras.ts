import type { Camera } from '../types';
import { MOCK_MUNICIPALITIES } from './municipalities';

export function generateCameras(): Camera[] {
  const cameras: Camera[] = [];
  const municipalities = MOCK_MUNICIPALITIES.filter(
    (m) => m.status === 'with_vigia' || m.status === 'implementing',
  );

  municipalities.forEach((muni) => {
    const onlineCount = muni.camerasOnline;
    const offlineCount = muni.camerasOffline;
    const totalCount = muni.camerasCount;

    for (let i = 0; i < totalCount; i++) {
      const isOnline = i < onlineCount;
      const isMaintenance =
        i >= onlineCount && i < onlineCount + Math.min(3, offlineCount);
      cameras.push({
        id: `cam-${muni.code}-${String(i + 1).padStart(4, '0')}`,
        name: `Câmera ${muni.name} ${String(i + 1).padStart(3, '0')}`,
        municipality: muni.name,
        municipalityCode: muni.code,
        latitude: muni.centroid[0] + (Math.random() - 0.5) * 0.1,
        longitude: muni.centroid[1] + (Math.random() - 0.5) * 0.1,
        status: isOnline ? 'online' : isMaintenance ? 'maintenance' : 'offline',
        streamUrl: isOnline
          ? `https://stream.vigiamais.mt.gov.br/cam-${muni.code}-${String(i + 1).padStart(4, '0')}.m3u8`
          : undefined,
        thumbnailUrl: isOnline
          ? `https://stream.vigiamais.mt.gov.br/thumb/cam-${muni.code}-${String(i + 1).padStart(4, '0')}.jpg`
          : undefined,
        lastSeen: isOnline
          ? new Date(Date.now() - Math.random() * 300000).toISOString()
          : new Date(Date.now() - Math.random() * 86400000).toISOString(),
        uptime: isOnline ? 95 + Math.random() * 5 : 0,
        type: i < totalCount * 0.1 ? 'lpr' : i < totalCount * 0.05 ? 'movel' : 'fixa',
        address: `Rua ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}, ${Math.floor(Math.random() * 999) + 1}`,
        region: muni.name,
      });
    }
  });

  return cameras;
}

export const MOCK_CAMERAS = generateCameras();
