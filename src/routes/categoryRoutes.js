const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController'); 
const {
  validateCreateCategory,
  validateUpdateCategory,
  handleValidationErrors,
} = require('../validators/categoryValidators');

const router = express.Router();

// Create a new category
router.post(
  '/',
  authMiddleware(['Admin']),
  validateCreateCategory,
  handleValidationErrors,
  createCategory 
);

// Get all categories
router.get('/', authMiddleware(['Admin', 'User']), getAllCategories);

// Get a single category by ID
router.get('/:id', authMiddleware(['Admin', 'User']), getCategoryById);

// Update a category by ID
router.patch(
  '/:id',
  authMiddleware(['Admin']),
  validateUpdateCategory,
  handleValidationErrors,
  updateCategory 
);

// Delete a category by ID
router.delete('/:id', authMiddleware(['Admin']), deleteCategory);

module.exports = router;