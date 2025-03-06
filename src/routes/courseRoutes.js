import express from 'express';

import authMiddleware from '../middlewares/authMiddleware';
import courseController from '../controllers/courseController';

const router = express.Router();

router.get('/', authMiddleware(['Admin', 'User']), courseController.getAllCourses);
router.get('/:id', authMiddleware(['Admin', 'User']), courseController.getCourseById);
router.post('/', authMiddleware(['Admin', 'User']), courseController.createCourse);
router.put('/:id', authMiddleware(['Admin', 'User']), courseController.updateCourse);
router.delete('/:id', authMiddleware(['Admin', 'User']), courseController.deleteCourse);
router.delete('/', authMiddleware(['Admin']), courseController.deleteAllCourses);

export default router;