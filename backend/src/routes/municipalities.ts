import type { Request, Response } from 'express';
import express from 'express';
import { dashboardService } from '../services/dashboardService';

const router = express.Router();

// GET /api/municipalities - Lista de municípios
router.get('/', (_req: Request, res: Response) => {
  const municipalities = dashboardService.getMunicipalities();
  res.json({ success: true, data: municipalities, total: municipalities.length });
});

// GET /api/municipalities/:code - Detalhes de um município
router.get('/:code', (req: Request, res: Response) => {
  const municipality = dashboardService.getMunicipalityByCode(req.params.code);
  if (!municipality) {
    return res
      .status(404)
      .json({ success: false, error: 'Município não encontrado' });
  }
  res.json({ success: true, data: municipality });
});

export default router;
