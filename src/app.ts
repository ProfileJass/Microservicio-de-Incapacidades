import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import incapacityRouter from './microservices/incapacities/infrastructure/routers/incapacity.router';
import dataRouter from './microservices/incapacities/infrastructure/routers/data.router';
import { errorHandler, notFoundHandler } from './shared/middleware/error-handler.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is running' });
});

app.use('/api/incapacities', incapacityRouter);
app.use('/api/data', dataRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
