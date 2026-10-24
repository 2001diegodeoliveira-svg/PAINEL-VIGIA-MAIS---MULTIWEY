import type { NetworkHealth } from '../types';

export const MOCK_NETWORK_HEALTH: NetworkHealth = {
  uptime: 94.5,
  recurringFailures: 23,
  avgRepairTime: 4.2,
  camerasWithIssues: [
    {
      cameraId: 'cam-5103403-0087',
      name: 'Câmera Cuiabá 087',
      municipality: 'Cuiabá',
      failuresCount: 8,
    },
    {
      cameraId: 'cam-5108402-0145',
      name: 'Câmera Várzea Grande 145',
      municipality: 'Várzea Grande',
      failuresCount: 6,
    },
    {
      cameraId: 'cam-5107008-0201',
      name: 'Câmera Sinop 201',
      municipality: 'Sinop',
      failuresCount: 5,
    },
  ],
};
