import app from './app';
import { connectDB } from './config/database';
import { seedDatabase } from './config/seed';
import { config } from './config/config';
import process from 'process';

const startServer = async () => {
  try {
    await connectDB();
    
    // Ejecutar seed de datos de prueba
    await seedDatabase();
    
    app.listen(config.port, () => {});
  } catch (error) {
    process.exit(1);
  }
};

startServer();