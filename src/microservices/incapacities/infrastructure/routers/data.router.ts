import { Router } from 'express';
import { DataController } from '../controllers/data.controller';

const dataRouter = Router();
const dataController = new DataController();

// Rutas de usuarios
dataRouter.get('/users', dataController.getAllUsers);
dataRouter.get('/users/:id', dataController.getUserById);

// Rutas de nóminas
dataRouter.get('/payrolls', dataController.getAllPayrolls);
dataRouter.get('/payrolls/:id', dataController.getPayrollById);
dataRouter.get('/payrolls/user/:userId', dataController.getPayrollsByUser);

// Rutas de empresas
dataRouter.get('/companies', dataController.getAllCompanies);

export default dataRouter;
