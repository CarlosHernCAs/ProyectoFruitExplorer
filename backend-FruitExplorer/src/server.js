import app from './app.js';
import dotenv from 'dotenv';
import { initRoles } from './config/seed.js';

await initRoles();
dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

