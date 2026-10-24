import type { Request, Response, NextFunction } from 'express';

export const corsMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  const origin = process.env.CORS_ORIGIN || '*';

  res.header('Access-Control-Allow-Origin', origin);
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  if (_req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
};
