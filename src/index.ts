import './shared/config/env.config'; // Valida variables de entorno primero
import './domain/model'; // Carga los modelos antes de conectar
import app from './app';
import { connectDB } from './config/database';
import { config } from './config/config';
import process from 'process';

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(config.port, () => {
      console.log(`✅ IncapacitiesService corriendo en http://localhost:${config.port}`);
      console.log(`📊 Entorno: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();