const Category = require("../models/Category");
const { validateCategory } = require("../utils/validators");

// Create a new category
const createCategory = async (name, description) => {
  validateCategory(name, description);
  const category = new Category({ name, description });
  await category.save();
  return category;
};

// Get all categories
const getAllCategories = async () => {
  return await Category.find();
};

// Get a single category by ID
const getCategoryById = async (id) => {
  return await Category.findById(id);
};

// Update a category by ID
const updateCategory = async (id, name, description) => {

  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");

  category.name = name || category.name;
  category.description = description || category.description;
  category.updatedAt = Date.now();

  await category.save();
  return category;
};

// Delete a category by ID
const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new Error("Category not found");
  return category;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
