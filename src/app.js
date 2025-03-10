const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const indexRoutes = require('./routes');


dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', indexRoutes);


// Connect to DB
connectDB();

module.exports = app;