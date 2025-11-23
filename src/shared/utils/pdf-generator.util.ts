import PDFDocument from 'pdfkit';
import { IncapacityResponse } from '../../application/dto/incapacity.response';

export class PDFGenerator {
  static async generateIncapacityPDF(incapacity: IncapacityResponse): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (error) => reject(error));

        // Header
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .text('CERTIFICADO DE INCAPACIDAD', { align: 'center' })
           .moveDown();

        doc.fontSize(10)
           .font('Helvetica')
           .text(`Fecha de Generación: ${new Date().toLocaleDateString('es-ES')}`, { align: 'right' })
           .moveDown(2);

        // Información del documento
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('INFORMACIÓN DEL CERTIFICADO', { underline: true })
           .moveDown();

        // Datos de la incapacidad
        doc.fontSize(11)
           .font('Helvetica-Bold')
           .text('ID de Incapacidad: ', { continued: true })
           .font('Helvetica')
           .text(incapacity.id_incapacity.toString())
           .moveDown(0.5);

        doc.font('Helvetica-Bold')
           .text('Estado: ', { continued: true })
           .font('Helvetica')
           .text(incapacity.status)
           .moveDown(0.5);

        doc.font('Helvetica-Bold')
           .text('Tipo de Incapacidad: ', { continued: true })
           .font('Helvetica')
           .text(incapacity.type)
           .moveDown(1.5);

        // Información del usuario
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('INFORMACIÓN DEL EMPLEADO', { underline: true })
           .moveDown();

        doc.fontSize(11)
           .font('Helvetica-Bold')
           .text('ID Usuario: ', { continued: true })
           .font('Helvetica')
           .text(incapacity.id_user.toString())
           .moveDown(0.5);

        doc.font('Helvetica-Bold')
           .text('Nombre: ', { continued: true })
           .font('Helvetica')
           .text(`${incapacity.firstName} ${incapacity.lastName}`)
           .moveDown(0.5);

        doc.font('Helvetica-Bold')
           .text('Email: ', { continued: true })
           .font('Helvetica')
           .text(incapacity.email)
           .moveDown(0.5);

        doc.font('Helvetica-Bold')
           .text('Rol: ', { continued: true })
           .font('Helvetica')
           .text(incapacity.role)
           .moveDown(0.5);

        doc.font('Helvetica-Bold')
           .text('ID Nómina: ', { continued: true })
           .font('Helvetica')
           .text(incapacity.id_payroll.toString())
           .moveDown(0.5);

        doc.font('Helvetica-Bold')
           .text('ID Compañía: ', { continued: true })
           .font('Helvetica')
           .text(incapacity.id_company.toString())
           .moveDown(1.5);

        // Fechas
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('PERÍODO DE INCAPACIDAD', { underline: true })
           .moveDown();

        doc.fontSize(11)
           .font('Helvetica-Bold')
           .text('Fecha de Inicio: ', { continued: true })
           .font('Helvetica')
           .text(new Date(incapacity.start_date).toLocaleDateString('es-ES'))
           .moveDown(0.5);

        doc.font('Helvetica-Bold')
           .text('Fecha de Fin: ', { continued: true })
           .font('Helvetica')
           .text(new Date(incapacity.end_date).toLocaleDateString('es-ES'))
           .moveDown(0.5);

        const startDate = new Date(incapacity.start_date);
        const endDate = new Date(incapacity.end_date);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        doc.font('Helvetica-Bold')
           .text('Días de Incapacidad: ', { continued: true })
           .font('Helvetica')
           .text(diffDays.toString())
           .moveDown(1.5);

        // Observaciones
        if (incapacity.observacion) {
          doc.fontSize(14)
             .font('Helvetica-Bold')
             .text('OBSERVACIONES', { underline: true })
             .moveDown();

          doc.fontSize(11)
             .font('Helvetica')
             .text(incapacity.observacion, { align: 'justify' })
             .moveDown(2);
        }

        // Footer con datos JSON
        doc.fontSize(10)
           .font('Helvetica-Oblique')
           .text('---', { align: 'center' })
           .moveDown(0.5);

        doc.fontSize(9)
           .font('Helvetica-Bold')
           .text('DATOS COMPLETOS (JSON)', { align: 'center' })
           .moveDown(0.5);

        doc.fontSize(8)
           .font('Courier')
           .text(JSON.stringify(incapacity, null, 2), {
             align: 'left',
             width: 500
           });

        // Finalizar el documento
        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }
}
