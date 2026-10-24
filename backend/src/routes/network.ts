import type { Request, Response } from 'express';
import express from 'express';
import { dashboardService } from '../services/dashboardService';

const router = express.Router();

// GET /api/network/health - Saúde da rede
router.get('/health', (_req: Request, res: Response) => {
  const health = dashboardService.getNetworkHealth();
  res.json({ success: true, data: health });
});

export default router;
