import { Router } from 'express';
import { DataController } from '../controllers/data.controller';

const dataRouter = Router();
const dataController = new DataController();

dataRouter.get('/users', dataController.getAllUsers);
dataRouter.get('/users/:id', dataController.getUserById);

dataRouter.get('/payrolls', dataController.getAllPayrolls);
dataRouter.get('/payrolls/:id', dataController.getPayrollById);
dataRouter.get('/payrolls/user/:userId', dataController.getPayrollsByUser);

dataRouter.get('/companies', dataController.getAllCompanies);
dataRouter.get('/companies', dataController.getAllCompanies);

export default dataRouter;
