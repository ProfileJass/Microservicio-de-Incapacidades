import { Response } from 'express';
import { ApiResponse, ApiError, ApiValidationError, ValidationError } from '../interfaces/api-response.interface';

export class ResponseHandler {
  
  static success<T>(res: Response, data: T, message: string = 'Operación exitosa', statusCode: number = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(response);
  }

  static successNoData(res: Response, message: string = 'Operación exitosa', statusCode: number = 200): Response {
    const response: ApiResponse = {
      success: true,
      message,
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, error: string, statusCode: number = 500): Response {
    const response: ApiError = {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      code: statusCode
    };
    return res.status(statusCode).json(response);
  }

  static validationError(res: Response, validationErrors: ValidationError[], message: string = 'Errores de validación'): Response {
    const response: ApiValidationError = {
      success: false,
      message,
      error: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString(),
      code: 400,
      validationErrors
    };
    return res.status(400).json(response);
  }

  static notFound(res: Response, resource: string = 'Recurso'): Response {
    return this.error(res, `${resource} no encontrado`, 'NOT_FOUND', 404);
  }

  static badRequest(res: Response, message: string = 'Solicitud inválida', error: string = 'BAD_REQUEST'): Response {
    return this.error(res, message, error, 400);
  }

  static unauthorized(res: Response, message: string = 'No autorizado'): Response {
    return this.error(res, message, 'UNAUTHORIZED', 401);
  }

  static forbidden(res: Response, message: string = 'Acceso denegado'): Response {
    return this.error(res, message, 'FORBIDDEN', 403);
  }

  static conflict(res: Response, message: string = 'Conflicto de datos'): Response {
    return this.error(res, message, 'CONFLICT', 409);
  }

  static internalError(res: Response, message: string = 'Error interno del servidor', error?: string): Response {
    return this.error(res, message, error || 'INTERNAL_SERVER_ERROR', 500);
  }
}

export default ResponseHandler;
