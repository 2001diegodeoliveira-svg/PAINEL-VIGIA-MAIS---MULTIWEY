import type { Request, Response } from 'express';
import express from 'express';
import { dashboardService } from '../services/dashboardService';

const router = express.Router();

// GET /api/kpis - Indicadores-chave
router.get('/', (_req: Request, res: Response) => {
  const kpis = dashboardService.getKPIs();
  res.json({ success: true, data: kpis });
});

export default router;
