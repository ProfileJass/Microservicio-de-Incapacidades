import app from './app';
import { connectDB } from './config/database';
import { seedDatabase } from './config/seed';
import { config } from './config/config';
import process from 'process';

const startServer = async () => {
  try {
    await connectDB();
    
    await seedDatabase();
    
    app.listen(config.port, () => {
      console.log(`Servidor corriendo en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();