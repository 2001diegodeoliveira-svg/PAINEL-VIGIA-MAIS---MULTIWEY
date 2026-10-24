import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { corsMiddleware } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import dashboardRoutes from './routes/dashboard';
import cameraRoutes from './routes/cameras';
import municipalityRoutes from './routes/municipalities';
import kpiRoutes from './routes/kpis';
import actionRoutes from './routes/actions';
import networkRoutes from './routes/network';
import lprRoutes from './routes/lpr';
import analyticsRoutes from './routes/analytics';
import geojsonRoutes from './routes/geojson';
import sinfraRoutes from './routes/sinfra';

dotenv.config();

export function createApp(): Application {
  const app = express();
  const apiPrefix = process.env.API_PREFIX || '/api';

  // Middleware de segurança
  app.use(helmet());
  app.use(cors());
  app.use(corsMiddleware);

  // Parsing de corpo
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Log de requisições
  app.use(morgan(process.env.LOG_LEVEL || 'dev'));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'painel-vigia-mais-backend',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // Rotas da API
  app.use(`${apiPrefix}/dashboard`, dashboardRoutes);
  app.use(`${apiPrefix}/cameras`, cameraRoutes);
  app.use(`${apiPrefix}/municipalities`, municipalityRoutes);
  app.use(`${apiPrefix}/kpis`, kpiRoutes);
  app.use(`${apiPrefix}/actions`, actionRoutes);
  app.use(`${apiPrefix}/network`, networkRoutes);
  app.use(`${apiPrefix}/lpr`, lprRoutes);
  app.use(`${apiPrefix}/analytics`, analyticsRoutes);
  app.use(`${apiPrefix}/geojson`, geojsonRoutes);
app.use(`${apiPrefix}/sinfra`, sinfraRoutes);

  // 404
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return app;
}
