import type { Request, Response } from 'express';
import express from 'express';
import { dashboardService } from '../services/dashboardService';

const router = express.Router();

// GET /api/actions - Lista paginada de ações
router.get('/', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 50;
  const result = dashboardService.getActions({ page, limit });
  res.json({ success: true, data: result.data, total: result.total });
});

// GET /api/actions/stats - Estatísticas de ações
router.get('/stats', (_req: Request, res: Response) => {
  const stats = dashboardService.getActionStats();
  res.json({ success: true, data: stats });
});

export default router;
