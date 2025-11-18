import { Request, Response } from 'express';
import { IncapacityService } from '../../application/incapacity.service';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import ResponseHandler from '../../shared/utils/response-handler.util';

export class IncapacityController {
  constructor(private readonly incapacityService: IncapacityService) {}

  createIncapacity = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const incapacity = await this.incapacityService.createIncapacity(req.body);
    return ResponseHandler.success(res, incapacity, 'Incapacidad creada exitosamente', 201);
  });

  getAllIncapacities = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const incapacities = await this.incapacityService.getAllIncapacities();
    return ResponseHandler.success(res, incapacities, `Se encontraron ${incapacities.length} incapacidades`);
  });

  getIncapacitiesByUser = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;
    const userIdNum = parseInt(userId, 10);
    const incapacities = await this.incapacityService.getIncapacitiesByUser(userIdNum);
    return ResponseHandler.success(res, incapacities, `Se encontraron ${incapacities.length} incapacidades para el usuario`);
  });

  updateIncapacity = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    const incapacity = await this.incapacityService.updateIncapacity(idNum, req.body);
    return ResponseHandler.success(res, incapacity, 'Incapacidad actualizada exitosamente');
  });
}
