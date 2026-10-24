import type { Request, Response } from 'express';
import express from 'express';
import { dashboardService } from '../services/dashboardService';

const router = express.Router();

// GET /api/lpr/alerts - Alertas LPR
router.get('/alerts', (_req: Request, res: Response) => {
  const alerts = dashboardService.getLPRAlerts();
  const activeAlerts = alerts.filter((a) => a.status === 'active');
  res.json({
    success: true,
    data: alerts,
    active: activeAlerts.length,
    total: alerts.length,
  });
});

export default router;
