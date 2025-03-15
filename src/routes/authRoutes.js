const express = require('express');
const { 
  signupUser, 
  loginUser, 
  verifyEmail, 
  forgotPassword, 
  resetPassword,
  resendVerificationEmail
} = require('../controllers/authController');
const { 
  validateSignup, 
  validateLogin, 
  validateEmail,
  validateResetPassword,
  handleValidationErrors 
} = require('../validators/authValidators');

const router = express.Router();

// Auth routes
router.post('/signup', validateSignup, handleValidationErrors, signupUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', validateEmail, handleValidationErrors, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, handleValidationErrors, resetPassword);
router.post('/resend-verification', validateEmail, handleValidationErrors, resendVerificationEmail);

module.exports = router;