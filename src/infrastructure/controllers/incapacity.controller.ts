import { Request, Response } from 'express';
import { IncapacityService } from '../../application/incapacity.service';
import { asyncHandler } from '../../shared/middleware/error-handler.middleware';
import ResponseHandler from '../../shared/utils/response-handler.util';
import { PDFGenerator } from '../../shared/utils/pdf-generator.util';
import * as fs from 'fs';
import * as path from 'path';

export class IncapacityController {
  constructor(private readonly incapacityService: IncapacityService) {}

  createIncapacity = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const incapacity = await this.incapacityService.createIncapacity(req.body);
    
    // Generar PDF
    const pdfBuffer = await PDFGenerator.generateIncapacityPDF(incapacity);
    
    // Crear directorio para PDFs si no existe
    const pdfDir = path.join(__dirname, '../../../pdfs');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    
    // Guardar PDF con nombre único
    const pdfFilename = `incapacidad_${incapacity.id_incapacity}_${Date.now()}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFilename);
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    // Retornar respuesta con información del PDF
    return ResponseHandler.success(
      res, 
      {
        ...incapacity,
        pdf: {
          filename: pdfFilename,
          path: `/pdfs/${pdfFilename}`,
          size: pdfBuffer.length
        }
      }, 
      'Incapacidad creada exitosamente y PDF generado', 
      201
    );
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

  downloadPDF = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { filename } = req.params;
    const pdfPath = path.join(__dirname, '../../../pdfs', filename);
    
    if (!fs.existsSync(pdfPath)) {
      res.status(404).json({ error: 'PDF no encontrado' });
      return;
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(pdfPath);
  });
}
