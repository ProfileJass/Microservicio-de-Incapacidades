import { Sequelize } from 'sequelize';
import { config } from './config';
import { UserModel } from '../microservices/incapacities/domain/model/user.model';
import { CompanyModel } from '../microservices/incapacities/domain/model/company.model';
import { PayrollModel } from '../microservices/incapacities/domain/model/payroll.model';
import { IncapacityModel } from '../microservices/incapacities/domain/model/incapacity.model';

export const sequelize = new Sequelize({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  dialect: config.database.dialect,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    
    // Solo sincronizar en desarrollo, en producción las tablas ya existen
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
    }
  } catch (error) {
    throw error;
  }
};
