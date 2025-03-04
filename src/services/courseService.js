const Course = require("../models/Course");
const Category = require("../models/Category");
const { validateCourse } = require("../utils/validators");

// Create a new course
const createCourse = async (
  title,
  description,
  difficulty,
  tags,
  categoryId,
  createdBy
) => {
  validateCourse(title, description, difficulty, tags, categoryId);
  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

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
};

// Update a course by ID
const updateCourse = async (
  id,
  title,
  description,
  difficulty,
  tags,
  categoryId
) => {
  validateCourse(title, description, difficulty, tags, categoryId);
  const course = await Course.findById(id);
  if (!course) throw new Error("Course not found");

  course.title = title || course.title;
  course.description = description || course.description;
  course.difficulty = difficulty || course.difficulty;
  course.tags = tags || course.tags;
  course.category = categoryId || course.category;
  course.updatedAt = Date.now();

  await course.save();
  return course;
};

// get all courses
const getAllCourses = async () => {
  return await Course.find();
};

// get specific course by id
const getCourseById = async (id) => {
  return await Course.findById(id);
};

//delete the course
const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id);
  if (!course) throw new Error("Course not found");
  return course;
};

// Bulk delete all courses
const deleteAllCourses = async () => {
  const result = await Course.deleteMany({}); 
  return {
    message: "All courses deleted successfully",
    deletedCount: result.deletedCount,
  };
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  getAllCourses,
  deleteAllCourses,
};
