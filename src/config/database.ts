import { Sequelize } from 'sequelize';
import { config } from './config';
import { UserModel } from '../domain/model/user.model';
import { CompanyModel } from '../domain/model/company.model';
import { PayrollModel } from '../domain/model/payroll.model';
import { IncapacityModel } from '../domain/model/incapacity.model';

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
    
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
    }
  } catch (error) {
    throw error;
  }
};
