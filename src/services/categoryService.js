const Category = require('../models/Category');

// Create a new category
const createCategory = async (name, description) => {
  try {
    const category = new Category({ name, description });
    await category.save();
    return category;
  } catch (error) {
    console.error('Error creating category:', error.message);
    throw new Error('Failed to create category');
  }
};

// Get all categories
const getAllCategories = async () => {
  try {
    return await Category.find();
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    throw new Error('Failed to fetch categories');
  }
};

// Get a single category by ID
const getCategoryById = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  } catch (error) {
    console.error('Error fetching category:', error.message);
    throw new Error('Failed to fetch category');
  }
};

// Update a category by ID
const updateCategory = async (id, updates ) => {
  try {
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true } 
    );

    if (!updatedCategory) {
      throw new Error('Category not found');
    }

    return updatedCategory;
  } catch (error) {
    console.error('Error updating category:', error.message);
    throw new Error('Failed to update category');
  }
};

// Delete a category by ID
const deleteCategory = async (id) => {
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  } catch (error) {
    console.error('Error deleting category:', error.message);
    throw new Error('Failed to delete category');
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};