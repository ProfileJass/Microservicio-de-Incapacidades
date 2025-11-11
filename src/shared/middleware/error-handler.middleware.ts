import { Request, Response, NextFunction } from 'express';
import ResponseHandler from '../utils/response-handler.util';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const statusCode = error.statusCode || 500;
  
  switch (statusCode) {
    case 400:
      return ResponseHandler.badRequest(res, error.message);
    case 401:
      return ResponseHandler.unauthorized(res, error.message);
    case 403:
      return ResponseHandler.forbidden(res, error.message);
    case 404:
      return ResponseHandler.notFound(res, error.message);
    case 409:
      return ResponseHandler.conflict(res, error.message);
    default:
      return ResponseHandler.internalError(
        res,
        'Error interno del servidor',
        error.message
      );
  }
};

export const notFoundHandler = (req: Request, res: Response): Response => {
  return ResponseHandler.notFound(
    res,
    `Ruta ${req.method} ${req.url} no encontrada`
  );
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default { errorHandler, notFoundHandler, asyncHandler };
