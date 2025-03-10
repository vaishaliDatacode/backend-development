const express = require('express');
const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const categoryRoutes = require('./categoryRoutes');

const router = express.Router();

// Use all routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/category', categoryRoutes);

module.exports = router;