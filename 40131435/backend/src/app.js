import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './routes/index.js';
import { errorHandler } from './middleware/error.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.get('/health', (req,res) => res.json({ status: 'ok' }));
app.use('/api', router);
app.use((req,res) => res.status(404).json({ message: 'مسیر پیدا نشد' }));
app.use(errorHandler);
app.listen(process.env.PORT || 4000, () => console.log(`API listening on ${process.env.PORT || 4000}`));
