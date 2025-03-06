import courseService from '../services/courseService';

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, difficulty, tags, category } = req.body;
    const createdBy = req.user.userId; 
    const course = await courseService.createCourse(title, description, difficulty, tags, category, createdBy);
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.status(200).json({ courses });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ course });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a course by ID
const updateCourse = async (req, res) => {
  try {
    const { title, description, difficulty, tags, category } = req.body;
    const course = await courseService.updateCourse(req.params.id, title, description, difficulty, tags, category);
    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a course by ID
const deleteCourse = async (req, res) => {
  try {
    const course = await courseService.deleteCourse(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully', course });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bulk delete all courses (Admin only)
const deleteAllCourses = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') throw new Error('Only admins can perform this action');
    const result = await courseService.deleteAllCourses();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  deleteAllCourses,
};