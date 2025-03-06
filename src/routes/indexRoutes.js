import express from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import categoryRoutes from './categoryRoutes';

const router = express.Router();

// Use all routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/category', categoryRoutes);

export default router;