import type { LPRAlert } from '../types';

export const MOCK_LPR_ALERTS: LPRAlert[] = [
  {
    id: 'lpr-1',
    plate: 'ABC-1234',
    cameraId: 'cam-5103403-0150',
    cameraName: 'Câmera Cuiabá 150 (LPR)',
    municipality: 'Cuiabá',
    timestamp: '2026-10-23T14:28:00',
    restrictionType: 'stolen',
    status: 'active',
  },
  {
    id: 'lpr-2',
    plate: 'XYZ-9876',
    cameraId: 'cam-5107008-0089',
    cameraName: 'Câmera Sinop 089 (LPR)',
    municipality: 'Sinop',
    timestamp: '2026-10-23T13:55:00',
    restrictionType: 'wanted',
    status: 'active',
  },
  {
    id: 'lpr-3',
    plate: 'DEF-5555',
    cameraId: 'cam-5108402-0034',
    cameraName: 'Câmera Várzea Grande 034 (LPR)',
    municipality: 'Várzea Grande',
    timestamp: '2026-10-23T12:10:00',
    restrictionType: 'traffic',
    status: 'resolved',
  },
];
