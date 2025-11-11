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
        id_user: '550e8400-e29b-41d4-a716-446655440001',
        firstName: 'Juan',
        lastName: 'Pérez García',
        email: 'juan.perez@empresa.com',
        role: 'empleado',
      },
      {
        id_user: '550e8400-e29b-41d4-a716-446655440002',
        firstName: 'María',
        lastName: 'González López',
        email: 'maria.gonzalez@empresa.com',
        role: 'empleado',
      },
      {
        id_user: '550e8400-e29b-41d4-a716-446655440003',
        firstName: 'Carlos',
        lastName: 'Rodríguez Martínez',
        email: 'carlos.rodriguez@empresa.com',
        role: 'administrador',
      },
      {
        id_user: '550e8400-e29b-41d4-a716-446655440004',
        firstName: 'Ana',
        lastName: 'Fernández Ruiz',
        email: 'ana.fernandez@empresa.com',
        role: 'empleado',
      },
      {
        id_user: '550e8400-e29b-41d4-a716-446655440005',
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
        id_company: '660e8400-e29b-41d4-a716-446655440001',
        nameCompany: 'Tech Solutions S.A.S',
        NIT: '900123456-1',
        adressCompany: 'Calle 100 #15-20, Bogotá',
        phone: '3001234567',
      },
      {
        id_company: '660e8400-e29b-41d4-a716-446655440002',
        nameCompany: 'Innovación Digital Ltda',
        NIT: '900234567-2',
        adressCompany: 'Carrera 50 #80-30, Medellín',
        phone: '3009876543',
      },
      {
        id_company: '660e8400-e29b-41d4-a716-446655440003',
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
        id_payroll: '770e8400-e29b-41d4-a716-446655440001',
        id_user: '550e8400-e29b-41d4-a716-446655440001', // Juan
        id_company: '660e8400-e29b-41d4-a716-446655440001', // Tech Solutions
        status: 'active',
      },
      {
        id_payroll: '770e8400-e29b-41d4-a716-446655440002',
        id_user: '550e8400-e29b-41d4-a716-446655440002', // María
        id_company: '660e8400-e29b-41d4-a716-446655440001', // Tech Solutions
        status: 'active',
      },
      {
        id_payroll: '770e8400-e29b-41d4-a716-446655440003',
        id_user: '550e8400-e29b-41d4-a716-446655440003', // Carlos
        id_company: '660e8400-e29b-41d4-a716-446655440002', // Innovación Digital
        status: 'active',
      },
      {
        id_payroll: '770e8400-e29b-41d4-a716-446655440004',
        id_user: '550e8400-e29b-41d4-a716-446655440004', // Ana
        id_company: '660e8400-e29b-41d4-a716-446655440002', // Innovación Digital
        status: 'active',
      },
      {
        id_payroll: '770e8400-e29b-41d4-a716-446655440005',
        id_user: '550e8400-e29b-41d4-a716-446655440005', // Luis
        id_company: '660e8400-e29b-41d4-a716-446655440003', // Servicios Empresariales
        status: 'active',
      },
    ];

    await PayrollModel.bulkCreate(payrolls);
    console.log(`${payrolls.length} nóminas de prueba creadas`);

    console.log('\nUsuarios:');
    users.forEach((user) => {
      console.log(`  - ${user.firstName} ${user.lastName} (ID: ${user.id_user})`);
    });
    console.log('\nEmpresas:');
    companies.forEach((company) => {
      console.log(`  - ${company.nameCompany} (ID: ${company.id_company})`);
    });
    console.log('\nNóminas:');
    payrolls.forEach((payroll, index) => {
      const user = users.find((u) => u.id_user === payroll.id_user);
      const company = companies.find((c) => c.id_company === payroll.id_company);
      console.log(`  - ${user?.firstName} en ${company?.nameCompany} (ID: ${payroll.id_payroll})`);
    });
  } catch (error) {
    console.error('Error al realizar seed:', error);
    throw error;
  }
};
