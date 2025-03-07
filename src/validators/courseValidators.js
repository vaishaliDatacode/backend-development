const { body, param, validationResult } = require('express-validator');

// Validation rules for creating a course
exports.validateCreateCourse = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('difficulty')
    .trim()
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
];

// Validation rules for updating a course
exports.validateUpdateCourse = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('difficulty')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Difficulty cannot be empty')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Difficulty must be Beginner, Intermediate, or Advanced'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category ID cannot be empty')
    .isMongoId()
    .withMessage('Invalid category ID'),
];

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};