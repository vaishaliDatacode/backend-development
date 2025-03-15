const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const indexRoutes = require('./routes');
const { setupDevEmailAccount } = require('./utils/emailUtils');



dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', indexRoutes);

setupDevEmailAccount();

// Connect to DB
connectDB();

module.exports = app;