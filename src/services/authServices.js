const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');

const signup = async (name, email, password, role) => {
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
  };

const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }
    const token = generateToken(user._id, user.role);
    return { user, token };
  };

module.exports = { signup, login };



