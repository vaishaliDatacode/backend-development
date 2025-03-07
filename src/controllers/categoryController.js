const categoryService = require('../services/categoryService');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await categoryService.createCategory(name, description);
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await categoryService.updateCategory(req.params.id, name, description);
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ message: 'Category deleted successfully', category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports =  {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};