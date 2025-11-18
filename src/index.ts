import app from './app';
import { connectDB } from './config/database';
import { seedDatabase } from './config/seed';
import { config } from './config/config';
import process from 'process';

const startServer = async () => {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await connectDB();
    console.log('✅ Base de datos conectada');
    
    console.log('🌱 Ejecutando seed de datos...');
    await seedDatabase();
    console.log('✅ Seed completado');
    
    app.listen(config.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
      console.log(`📝 Endpoint de autenticación: http://localhost:${config.port}/api/auth/login`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();