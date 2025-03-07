const express = require('express');
const { signupUser, loginUser } = require('../controllers/authController');
const { validateSignup, validateLogin, handleValidationErrors } = require('../validators/authValidators');

const router = express.Router();

router.post('/signup', validateSignup, handleValidationErrors, signupUser);

router.post('/login', validateLogin, handleValidationErrors, loginUser);

module.exports = router;