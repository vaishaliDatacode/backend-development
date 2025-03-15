const authService = require('../services/authServices');

// Sign up user
exports.signupUser = async (req, res) => {
  try {
    console.log('signup controller');
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser(name, email, password, role);
    res.status(201).json(result);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(error.message === 'Email already in use' ? 400 : 500).json({ 
      message: error.message 
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(error.message.includes('verify') ? 401 : 400).json({ 
      message: error.message 
    });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const result = await authService.verifyEmail(token);
    res.status(200).json(result);
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(error.message.includes('No user') ? 404 : 500).json({ 
      message: error.message 
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const result = await authService.resetPassword(token, password);
    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Resend verification email
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerificationEmail(email);
    res.status(200).json(result);
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(error.message.includes('already verified') ? 400 : 500).json({ 
      message: error.message 
    });
  }
};