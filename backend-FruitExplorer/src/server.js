import app from './app.js';
import dotenv from 'dotenv';
import { initRoles } from './config/seed.js';

await initRoles();
dotenv.config();

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0'; // Escuchar en todas las interfaces

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor corriendo en:`);
  console.log(`   - Local:   http://localhost:${PORT}`);
  console.log(`   - Red:     http://192.168.137.141:${PORT}`);
  console.log(`   - API:     http://192.168.137.141:${PORT}/api`);
  console.log(`   - Docs:    http://192.168.137.141:${PORT}/api-docs`);
});

