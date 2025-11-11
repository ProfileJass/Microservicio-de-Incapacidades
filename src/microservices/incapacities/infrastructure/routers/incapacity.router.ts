import { Router } from 'express';
import { IncapacityController } from '../controllers/incapacity.controller';
import { IncapacityService } from '../../application/incapacity.service';
import { IncapacityRepository } from '../repositories/incapacity.repository';

const incapacityRepository = new IncapacityRepository();
const incapacityService = new IncapacityService(incapacityRepository);
const incapacityController = new IncapacityController(incapacityService);

const router = Router();

router.post('/create', incapacityController.createIncapacity);
router.get('/getAll', incapacityController.getAllIncapacities);
router.get('/getByUser/:userId', incapacityController.getIncapacitiesByUser);
router.put('/update/:id', incapacityController.updateIncapacity);

export default router;
