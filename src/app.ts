import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import incapacityRouter from './infrastructure/routers/incapacity.router';
import dataRouter from './infrastructure/routers/data.router';
import authRouter from './shared/routers/auth.router';
import { errorHandler, notFoundHandler } from './shared/middleware/error-handler.middleware';
import { sequelize } from './config/database';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ 
      status: 'ok', 
      message: 'IncapacitiesService running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      message: 'IncapacitiesService unhealthy',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/incapacities', incapacityRouter);
app.use('/api/data', dataRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
