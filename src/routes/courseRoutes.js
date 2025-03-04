const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.get('/', authMiddleware(['Admin', 'User']), courseController.getAllCourses);
router.get('/:id', authMiddleware(['Admin', 'User']), courseController.getCourseById);
router.post('/', authMiddleware(['Admin', 'User']), courseController.createCourse);
router.put('/:id', authMiddleware(['Admin', 'User']), courseController.updateCourse);
router.delete('/:id', authMiddleware(['Admin', 'User']), courseController.deleteCourse);
router.delete('/', authMiddleware(['Admin']), courseController.deleteAllCourses);

module.exports = router;