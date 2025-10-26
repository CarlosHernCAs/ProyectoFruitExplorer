import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { router as apiRoutes } from './routes/index.js';
import { apiReference } from '@scalar/express-api-reference';
import openApiDocument from './docs/openapi.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api-docs', apiReference({
  spec: { content: openApiDocument },
  theme: 'purple',
  "layout": "classic"
}));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a la API de FruitExplorer 🍍' });
});

export default app;
