import type { Request, Response } from 'express';
import express from 'express';
import { dashboardService } from '../services/dashboardService';

const router = express.Router();

// GET /api/dashboard - Dados completos do dashboard
router.get('/', (_req: Request, res: Response) => {
  const data = dashboardService.getDashboardData();
  res.json({
    success: true,
    data,
    lastUpdated: data.lastUpdated,
  });
});

export default router;
