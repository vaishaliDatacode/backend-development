const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');

const signup = async (name, email, password, role) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const userData = { name, email, password };
    if (role) {
      userData.role = role;
    }
    const user = new User(userData);
    await user.save();

    return user;
  } catch (error) {
    console.error('Error in signup service:', error.message);
    throw new Error(`Signup failed: ${error.message}`);
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    user.password = undefined;

    const token = generateToken(user._id, user.role);

    return { user, token };
  } catch (error) {
    console.error('Error in login service:', error.message);
    throw new Error(`Login failed: ${error.message}`);
  }
};

module.exports = { signup, login };