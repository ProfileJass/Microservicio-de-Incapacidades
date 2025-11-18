import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { ForbiddenError } from '../errors/ForbiddenError';

interface JwtPayload {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      throw new UnauthorizedError('Formato de token inválido');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false,
        message: 'Token expirado' 
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido' 
      });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ 
        success: false,
        message: error.message 
      });
    }
    return res.status(500).json({ 
      success: false,
      message: 'Error en autenticación' 
    });
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  if (req.user.role.toUpperCase() !== 'ADMIN') {
    throw new ForbiddenError('Acceso denegado. Solo administradores');
  }
  
  next();
};

export const authorizeEmployee = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  next();
};
