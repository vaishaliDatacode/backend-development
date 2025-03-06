import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db';
import indexRoutes from './routes/indexRoutes';


dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', indexRoutes);


// Connect to DB
connectDB();

export default app;