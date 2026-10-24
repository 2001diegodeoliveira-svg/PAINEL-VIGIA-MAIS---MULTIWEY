import type { Request, Response } from 'express';
import express from 'express';
import { dashboardService } from '../services/dashboardService';

const router = express.Router();

// GET /api/analytics/before-after - Comparativo antes/depois
router.get('/before-after', (_req: Request, res: Response) => {
  const data = dashboardService.getBeforeAfter();
  res.json({ success: true, data });
});

// GET /api/analytics/coverage-suggestions - Sugestões de cobertura
router.get('/coverage-suggestions', (_req: Request, res: Response) => {
  const data = dashboardService.getCoverageSuggestions();
  res.json({ success: true, data });
});

export default router;
