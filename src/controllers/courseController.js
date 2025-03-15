const courseService = require("../services/courseService");

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, difficulty, tags, category } = req.body;
    const createdBy = req.user.userId; // Assuming user ID is available in the request
    const course = await courseService.createCourse(
      title,
      description,
      difficulty,
      tags,
      category,
      createdBy
    );
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all courses with optional filtering, sorting, and pagination
const getAllCourses = async (req, res) => {
  try {
    const { category, difficulty, tags } = req.query;

    const { sortBy, sortOrder } = req.query;

    const { page, limit } = req.query;

    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (difficulty) {
      // Validate difficulty is one of the allowed values
      const allowedDifficulties = ["Beginner", "Intermediate", "Advanced"];
      if (!allowedDifficulties.includes(difficulty)) {
        return res.status(400).json({
          message:
            "Invalid difficulty level. Must be one of: Beginner, Intermediate, Advanced",
        });
      }
      filters.difficulty = difficulty;
    }

    if (tags) {
      // If tags is a string, convert to array
      filters.tags = Array.isArray(tags) ? tags : [tags];
    }

    // Prepare sort options
    const sortOptions = {};

    if (sortBy) {
      // Validate sortBy parameter
      const allowedSortFields = ["date", "difficulty", "popularity"];
      if (!allowedSortFields.includes(sortBy)) {
        return res.status(400).json({
          message:
            "Invalid sort field. Must be one of: date, difficulty, popularity",
        });
      }

      // Validate sortOrder parameter (default to 'desc' if not provided)
      const order = sortOrder || "desc";
      if (order !== "asc" && order !== "desc") {
        return res.status(400).json({
          message: "Invalid sort order. Must be either: asc, desc",
        });
      }

      // Set sorting option based on sortBy field
      sortOptions[sortBy] = order;
    }

    // Prepare pagination options
    const paginationOptions = {};

    if (page) {
      const pageNum = parseInt(page, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({
          message: "Page must be a positive integer",
        });
      }
      paginationOptions.page = pageNum;
    }

    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return res.status(400).json({
          message: "Limit must be a positive integer between 1 and 100",
        });
      }
      paginationOptions.limit = limitNum;
    }

    // Get courses with all applied options
    const result = await courseService.getAllCourses(
      filters,
      sortOptions,
      paginationOptions
    );

    // Return formatted response with pagination metadata
    res.status(200).json({
      courses: result.courses,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in getAllCourses controller:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
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
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a course by ID
const deleteCourse = async (req, res) => {
  try {
    const userRole = req.user.role;
    let idsToDelete = [];
    
    if (req.params.id) {
      idsToDelete = [req.params.id]; 
    } 
    else if (req.body && req.body.ids) {
      idsToDelete = Array.isArray(req.body.ids) ? req.body.ids : [req.body.ids];
    }
    
    const result = await courseService.deleteCourses(idsToDelete, userRole);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in deleteCourse controller:', error);
    res.status(400).json({ message: error.message });
  }
};

const searchCourse = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
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
  searchCourse,
};
