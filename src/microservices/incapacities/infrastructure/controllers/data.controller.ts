import { Request, Response } from 'express';
import { UserModel } from '../../domain/model/user.model';
import { PayrollModel } from '../../domain/model/payroll.model';
import { CompanyModel } from '../../domain/model/company.model';
import { asyncHandler } from '../../../../shared/middleware/error-handler.middleware';
import ResponseHandler from '../../../../shared/utils/response-handler.util';

export class DataController {
  // Obtener todos los usuarios
  getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const users = await UserModel.findAll();
    return ResponseHandler.success(res, users, `Se encontraron ${users.length} usuarios`);
  });

  // Obtener un usuario por ID
  getUserById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    const user = await UserModel.findByPk(idNum);
    
    if (!user) {
      return ResponseHandler.error(res, 'Usuario no encontrado', 'USER_NOT_FOUND', 404);
    }
    
    return ResponseHandler.success(res, user, 'Usuario encontrado');
  });

  // Obtener todas las nóminas con información de usuario y empresa
  getAllPayrolls = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const payrolls = await PayrollModel.findAll({
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['id_user', 'firstName', 'lastName', 'email', 'role'],
        },
        {
          model: CompanyModel,
          as: 'company',
          attributes: ['id_company', 'nameCompany', 'NIT'],
        },
      ],
    });
    
    return ResponseHandler.success(res, payrolls, `Se encontraron ${payrolls.length} nóminas`);
  });

  // Obtener una nómina por ID
  getPayrollById = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    const payroll = await PayrollModel.findByPk(idNum, {
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['id_user', 'firstName', 'lastName', 'email', 'role'],
        },
        {
          model: CompanyModel,
          as: 'company',
          attributes: ['id_company', 'nameCompany', 'NIT', 'adressCompany', 'phone'],
        },
      ],
    });
    
    if (!payroll) {
      return ResponseHandler.error(res, 'Nómina no encontrada', 'PAYROLL_NOT_FOUND', 404);
    }
    
    return ResponseHandler.success(res, payroll, 'Nómina encontrada');
  });

  // Obtener nóminas de un usuario específico
  getPayrollsByUser = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;
    const userIdNum = parseInt(userId, 10);
    const payrolls = await PayrollModel.findAll({
      where: { id_user: userIdNum },
      include: [
        {
          model: CompanyModel,
          as: 'company',
          attributes: ['id_company', 'nameCompany', 'NIT'],
        },
      ],
    });
    
    return ResponseHandler.success(res, payrolls, `Se encontraron ${payrolls.length} nóminas para el usuario`);
  });

  // Obtener todas las empresas
  getAllCompanies = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const companies = await CompanyModel.findAll();
    return ResponseHandler.success(res, companies, `Se encontraron ${companies.length} empresas`);
  });
}
