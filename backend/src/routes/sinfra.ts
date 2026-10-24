import type { Request, Response } from 'express';
import express from 'express';
import { fetchCamerasFromSinfra } from '../services/sinfraService';

const router = express.Router();

// GET /api/sinfra/cameras - Câmeras da API oficial do SINFRA-MT
router.get('/cameras', async (_req: Request, res: Response) => {
  try {
    const cameras = await fetchCamerasFromSinfra();
    res.json({
      success: true,
      data: cameras,
      total: cameras.length,
      source: 'mapas.sinfra.mt.gov.br (ArcGIS FeatureServer)',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Falha ao buscar câmeras do SINFRA',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
