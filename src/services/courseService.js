const Course = require('../models/Course');
const Category = require('../models/Category');

// Create a new course
const createCourse = async (title, description, difficulty, tags, categoryId, createdBy) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error('Category not found');

    const course = new Course({
      title,
      description,
      difficulty,
      tags,
      category: categoryId,
      createdBy,
    });
    await course.save();
    return course;
  } catch (error) {
    console.error('Error creating course:', error.message);
    throw new Error('Failed to create course');
  }
};

// Update a course by ID
const updateCourse = async (id, updates) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updates,
      { new: true} // Return the updated document and run validators
    );

    if (!updatedCourse) {
      throw new Error('Course not found');
    }

    return updatedCourse;
  } catch (error) {
    console.error('Error updating course:', error.message);
    throw new Error('Failed to update course');
  }
};

// Get all courses
const getAllCourses = async () => {
  try {
    return await Course.find();
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    throw new Error('Failed to fetch courses');
  }
};

// Get a specific course by ID
const getCourseById = async (id) => {
  try {
    const course = await Course.findById(id);
    if (!course) throw new Error('Course not found');
    return course;
  } catch (error) {
    console.error('Error fetching course:', error.message);
    throw new Error('Failed to fetch course');
  }
};

const deleteCourses = async (ids = [], userRole) => {
  try {
    let result;
    if (ids.length === 0) {
      // Only admins can delete all courses
      if (userRole !== 'Admin') {
        throw new Error('Unauthorized: Only admins can delete all courses');
      }
      result = await Course.deleteMany({});
      return {
        message: 'All courses deleted successfully',
        deletedCount: result.deletedCount,
      };
    } else {
      // Delete specific courses by IDs
      result = await Course.deleteMany({ _id: { $in: ids } });
      return {
        message: 'Selected courses deleted successfully',
        deletedCount: result.deletedCount,
      };
    }
  } catch (error) {
    console.error('Error deleting courses:', error.message);
    throw new Error('Failed to delete courses');
  }
};

const searchCourses = async (query) => {
  try{
    return await Course.find({ $text: { $search: query } });
  }catch (error) {
    console.error('Error search courses:', error.message);
    throw new Error('Failed to search courses');
  }
};

module.exports = {
  createCourse,
  updateCourse,
  getCourseById,
  getAllCourses,
  deleteCourses,
  searchCourses
};