const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  searchCourse  
} = require('../controllers/courseController'); 
const {
  validateCreateCourse,
  validateUpdateCourse,
  handleValidationErrors,
} = require('../validators/courseValidators');

const router = express.Router();

router.get('/search', authMiddleware(['Admin', 'User']),  searchCourse);

// Create a new course
router.post(
  '/',
  authMiddleware(['Admin', 'User']),
  validateCreateCourse,
  handleValidationErrors,
  createCourse
);

// Get all courses
router.get('/', authMiddleware(['Admin', 'User']), getAllCourses);

// Get a single course by ID
router.get('/:id', authMiddleware(['Admin', 'User']), getCourseById);

// Update a course by ID
router.patch(
  '/:id',
  authMiddleware(['Admin', 'User']),
  validateUpdateCourse,
  handleValidationErrors,
  updateCourse
);

// Delete a course by ID
router.delete('/:id?', authMiddleware(['Admin', 'User']), deleteCourse);


module.exports = router;