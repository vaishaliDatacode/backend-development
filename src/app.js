import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import categoryRoutes from './routes/categoryRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/category', categoryRoutes);

// Connect to DB
connectDB();

export default app;