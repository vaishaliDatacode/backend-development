import { isValidObjectId } from 'mongoose';

// Validate category data
const validateCategory = (name, description) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Category name is required and must be a string');
  }
  if (description && typeof description !== 'string') {
    throw new Error('Category description must be a string');
  }
};

// Validate course data
const validateCourse = (title, description, difficulty, tags, categoryId) => {
  if (!title || typeof title !== 'string') {
    throw new Error('Course title is required and must be a string');
  }
  if (!description || typeof description !== 'string') {
    throw new Error('Course description is required and must be a string');
  }
  if (!difficulty || !['Beginner', 'Intermediate', 'Advanced'].includes(difficulty)) {
    throw new Error('Course difficulty is required and must be one of: Beginner, Intermediate, Advanced');
  }
  if (!Array.isArray(tags)) {
    throw new Error('Course tags must be an array');
  }
  if (!isValidObjectId(categoryId)) {
    throw new Error('Invalid category ID');
  }
};

export default { validateCategory, validateCourse };