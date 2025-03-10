const courseService = require('../services/courseService');

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, difficulty, tags, category } = req.body;
    const createdBy = req.user.userId; // Assuming user ID is available in the request
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
    const updates = req.body;
    const course = await courseService.updateCourse(req.params.id, updates);
    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a course by ID
const deleteCourse = async (req, res) => {
  try {
    const { ids } = req.body; 
    const userRole = req.user.role; 
    const result = await courseService.deleteCourses(ids, userRole);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchCourse = async (req, res) => {
  try{
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    const courses = await courseService.searchCourses(q);
    res.status(200).json({ courses });
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  searchCourse
  
};