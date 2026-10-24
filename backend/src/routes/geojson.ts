import type { Request, Response } from 'express';
import express from 'express';
import { dashboardService } from '../services/dashboardService';

const router = express.Router();

// GET /api/geojson/municipalities - GeoJSON dos municípios
router.get('/municipalities', (_req: Request, res: Response) => {
  const geojson = dashboardService.getMunicipalityGeoJSON();
  res.json(geojson);
});

export default router;
