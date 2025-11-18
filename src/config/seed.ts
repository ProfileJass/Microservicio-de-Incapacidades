import { UserModel } from '../domain/model/user.model';
import { CompanyModel } from '../domain/model/company.model';
import { PayrollModel } from '../domain/model/payroll.model';
import { sequelize } from './database';

export const seedDatabase = async (): Promise<void> => {
  try {

    const userCount = await UserModel.count();
    if (userCount === 0) {
      console.log('No hay usuarios en la base de datos. Crea usuarios primero desde el microservicio de usuarios.');
      return;
    }

    console.log(`${userCount} usuarios existentes en la base de datos`);

    const companies = [
      {
        nameCompany: 'Tech Solutions S.A.S',
        NIT: '900123456-1',
        adressCompany: 'Calle 100 #15-20, Bogotá',
        phone: '3001234567',
      },
      {
        nameCompany: 'Innovación Digital Ltda',
        NIT: '900234567-2',
        adressCompany: 'Carrera 50 #80-30, Medellín',
        phone: '3009876543',
      },
      {
        nameCompany: 'Servicios Empresariales S.A.',
        NIT: '900345678-3',
        adressCompany: 'Avenida 7 Norte #30-50, Cali',
        phone: '3101122334',
      },
    ];

    await CompanyModel.bulkCreate(companies);
    console.log(` ${companies.length} empresas de prueba creadas`);

    const createdUsers = await UserModel.findAll();
    const createdCompanies = await CompanyModel.findAll();

    console.log('\nUsuarios:');
    createdUsers.forEach((user: UserModel) => {
      console.log(`  - ${user.firstName} ${user.lastName} (ID: ${user.id_user})`);
    });
    console.log('\nEmpresas:');
    createdCompanies.forEach((company: CompanyModel) => {
      console.log(`  - ${company.nameCompany} (ID: ${company.id_company})`);
    });
  } catch (error) {
    console.error('Error al realizar seed:', error);
    throw error;
  }
};
