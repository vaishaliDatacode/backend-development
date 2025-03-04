const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

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

module.exports = app;