import { connectDB, sequelize } from './config/database';
import { seedDatabase } from './config/seed';

const testSeed = async () => {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await connectDB();
    
    console.log('🗑️  Limpiando datos previos (opcional)...');
    
    console.log('🌱 Ejecutando seed...');
    await seedDatabase();
    
    console.log('✅ Proceso completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testSeed();
