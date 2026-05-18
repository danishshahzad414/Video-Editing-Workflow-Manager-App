import express from 'express';
import cors from 'cors';
import { router as templateRoutes } from './routes/templates.js';
import { router as exportRoutes } from './routes/export.js';
import { router as aiRoutes } from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

app.use('/api/templates', templateRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Motion Studio backend running on http://localhost:${PORT}`);
});
