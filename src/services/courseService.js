const mongoose = require('mongoose');

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


const getAllCourses = async (filters = {}, sortOptions = {}, paginationOptions = {}) => {
  try {
    // console.log('start');
    const query = {};
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.difficulty) {
      query.difficulty = filters.difficulty;
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    
    let sort = {};
    let useAggregation = false;
    let difficultySort = null;
    
    // Default sort by createdAt in descending order (newest first) if no sort option provided
    if (Object.keys(sortOptions).length === 0) {
      sort = { createdAt: -1 };
    } else {
      if (sortOptions.date) {
        sort.createdAt = sortOptions.date === 'asc' ? 1 : -1;
      }
      
      if (sortOptions.difficulty) {
        useAggregation = true;
        difficultySort = sortOptions.difficulty;
      }
    }
    // console.log('pagination starts');
    // Set up pagination options
    const limit = paginationOptions.limit ? parseInt(paginationOptions.limit, 10) : 10;
    const page = paginationOptions.page ? parseInt(paginationOptions.page, 10) : 1;
    const skip = (page - 1) * limit;
    
    let courses;
    let totalCount;
    
    // If we need to sort by difficulty, we'll use aggregation
    if (useAggregation && difficultySort) {
      totalCount = await Course.countDocuments(query);
      
      const difficultyOrder = difficultySort === 'asc' 
        ? { Beginner: 1, Intermediate: 2, Advanced: 3 }
        : { Beginner: 3, Intermediate: 2, Advanced: 1 };
      
      const pipeline = [
        { $match: query },
        {
          $addFields: {
            difficultyOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ["$difficulty", "Beginner"] }, then: difficultyOrder.Beginner },
                  { case: { $eq: ["$difficulty", "Intermediate"] }, then: difficultyOrder.Intermediate },
                  { case: { $eq: ["$difficulty", "Advanced"] }, then: difficultyOrder.Advanced }
                ],
                default: 0
              }
            }
          }
        },
        { $sort: { difficultyOrder: 1, ...(Object.keys(sort).length > 0 ? sort : { createdAt: -1 }) } },
        { $skip: skip },
        { $limit: limit },
        { $project: { difficultyOrder: 0 } }
      ];
      
      courses = await Course.aggregate(pipeline);
      
      // We need to populate fields manually after aggregation
      if (courses.length > 0) {
        // Populate category
        const categoryIds = [...new Set(courses.map(course => course.category))];
        const categories = await Category.find({ _id: { $in: categoryIds } });
        const categoryMap = categories.reduce((map, category) => {
          map[category._id.toString()] = { _id: category._id, name: category.name };
          return map;
        }, {});
        
        // Populate createdBy (assuming you have a User model)
        const createdByIds = [...new Set(courses.map(course => course.createdBy))];
        const users = await mongoose.model('User').find({ _id: { $in: createdByIds } });
        const userMap = users.reduce((map, user) => {
          map[user._id.toString()] = { _id: user._id, username: user.username, email: user.email };
          return map;
        }, {});
        
        // Update each course with populated data
        courses = courses.map(course => {
          const courseCopy = { ...course };
          if (course.category) {
            courseCopy.category = categoryMap[course.category.toString()];
          }
          if (course.createdBy) {
            courseCopy.createdBy = userMap[course.createdBy.toString()];
          }
          return courseCopy;
        });
      }
    } else {
      // Normal query without custom difficulty sorting
      totalCount = await Course.countDocuments(query);
      
      courses = await Course.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('category', 'name')
        .populate('createdBy', 'username email');
    }
    
    // Return both the courses and pagination metadata
    return {
      courses,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      }
    };
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