import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  let statusCode = 500;
  let message = 'Erro interno do servidor';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (process.env.NODE_ENV !== 'production') {
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Rota não encontrada', 404));
};
