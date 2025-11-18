import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

interface TokenRequest {
  userId: string;
  role: 'admin' | 'employee';
}

router.post('/login', (req: Request, res: Response) => {
  try {
    const { userId, role }: TokenRequest = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: 'userId y role son requeridos'
      });
    }

    if (role !== 'admin' && role !== 'employee') {
      return res.status(400).json({
        success: false,
        message: 'role debe ser "admin" o "employee"'
      });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    const token = jwt.sign(
      { userId, role },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        expiresIn: '4h',
        userId,
        role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al generar el token',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
