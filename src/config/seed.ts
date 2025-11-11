import { UserModel } from '../microservices/incapacities/domain/model/user.model';
import { CompanyModel } from '../microservices/incapacities/domain/model/company.model';
import { PayrollModel } from '../microservices/incapacities/domain/model/payroll.model';
import { sequelize } from './database';

export const seedDatabase = async (): Promise<void> => {
  try {

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ force: false });

    // Verificar si ya hay datos
    const userCount = await UserModel.count();
    if (userCount > 0) {
      console.log('Ya existen datos en la base de datos. Omitiendo...');
      return;
    }

    // Crear usuarios de prueba
    const users = [
      {
        firstName: 'Juan',
        lastName: 'Pérez García',
        email: 'juan.perez@empresa.com',
        role: 'empleado',
      },
      {
        firstName: 'María',
        lastName: 'González López',
        email: 'maria.gonzalez@empresa.com',
        role: 'empleado',
      },
      {
        firstName: 'Carlos',
        lastName: 'Rodríguez Martínez',
        email: 'carlos.rodriguez@empresa.com',
        role: 'administrador',
      },
      {
        firstName: 'Ana',
        lastName: 'Fernández Ruiz',
        email: 'ana.fernandez@empresa.com',
        role: 'empleado',
      },
      {
        firstName: 'Luis',
        lastName: 'Martínez Sánchez',
        email: 'luis.martinez@empresa.com',
        role: 'empleado',
      },
    ];

    await UserModel.bulkCreate(users);
    console.log(`${users.length} usuarios de prueba creados`);

    // Crear empresas de prueba
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

    // Crear nóminas de prueba (vinculando usuarios con empresas)
    const payrolls = [
      {
        id_user: 1, // Juan
        id_company: 1, // Tech Solutions
        status: 'active',
      },
      {
        id_user: 2, // María
        id_company: 1, // Tech Solutions
        status: 'active',
      },
      {
        id_user: 3, // Carlos
        id_company: 2, // Innovación Digital
        status: 'active',
      },
      {
        id_user: 4, // Ana
        id_company: 2, // Innovación Digital
        status: 'active',
      },
      {
        id_user: 5, // Luis
        id_company: 3, // Servicios Empresariales
        status: 'active',
      },
    ];

    await PayrollModel.bulkCreate(payrolls);
    console.log(`${payrolls.length} nóminas de prueba creadas`);

    // Obtener los datos con IDs generados
    const createdUsers = await UserModel.findAll();
    const createdCompanies = await CompanyModel.findAll();
    const createdPayrolls = await PayrollModel.findAll();

    console.log('\nUsuarios:');
    createdUsers.forEach((user) => {
      console.log(`  - ${user.firstName} ${user.lastName} (ID: ${user.id_user})`);
    });
    console.log('\nEmpresas:');
    createdCompanies.forEach((company) => {
      console.log(`  - ${company.nameCompany} (ID: ${company.id_company})`);
    });
    console.log('\nNóminas:');
    createdPayrolls.forEach((payroll) => {
      const user = createdUsers.find((u) => u.id_user === payroll.id_user);
      const company = createdCompanies.find((c) => c.id_company === payroll.id_company);
      console.log(`  - ${user?.firstName} en ${company?.nameCompany} (ID Nómina: ${payroll.id_payroll})`);
    });
  } catch (error) {
    console.error('Error al realizar seed:', error);
    throw error;
  }
};
