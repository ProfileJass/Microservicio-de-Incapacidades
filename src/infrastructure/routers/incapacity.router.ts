import { Router } from 'express';
import { IncapacityController } from '../controllers/incapacity.controller';
import { IncapacityService } from '../../application/incapacity.service';
import { IncapacityRepository } from '../repositories/incapacity.repository';
import { authenticateToken, authorizeAdmin, authorizeEmployee } from '../../shared/middleware/auth.middleware';

const incapacityRepository = new IncapacityRepository();
const incapacityService = new IncapacityService(incapacityRepository);
const incapacityController = new IncapacityController(incapacityService);

const router = Router();

router.post('/create', authenticateToken, authorizeEmployee, incapacityController.createIncapacity);
router.get('/getByUser/:userId', authenticateToken, authorizeEmployee, incapacityController.getIncapacitiesByUser);

router.get('/getAll', authenticateToken, authorizeAdmin, incapacityController.getAllIncapacities);
router.put('/update/:id', authenticateToken, authorizeAdmin, incapacityController.updateIncapacity);

export default router;
