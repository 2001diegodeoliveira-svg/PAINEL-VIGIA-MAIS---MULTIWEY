import type { Request, Response } from 'express';
import express from 'express';
import { dashboardService } from '../services/dashboardService';

const router = express.Router();

// GET /api/cameras - Lista paginada de câmeras
router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 50;
  const municipalityCode = req.query.municipality as string | undefined;

  let cameras = dashboardService.getCameras({ page, limit }).data;

  if (municipalityCode) {
    cameras = dashboardService.getCamerasByMunicipality(municipalityCode);
  }

  res.json({
    success: true,
    data: cameras,
    total: cameras.length,
  });
});

// GET /api/cameras/:id - Detalhes de uma câmera
router.get('/:id', (req: Request, res: Response) => {
  const camera = dashboardService.getCameraById(req.params.id);
  if (!camera) {
    return res.status(404).json({ success: false, error: 'Câmera não encontrada' });
  }
  res.json({ success: true, data: camera });
});

export default router;
