import express from 'express';
import authRoutes from './routes/authRoutes.js'; 
import cors from 'cors'
const app = express();
app.use(express.json());
app.use(cors());
app.use(authRoutes);

export default app;
