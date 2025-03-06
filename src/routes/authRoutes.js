import express from 'express';
import { signupUser, loginUser } from '../controllers/authController';
import { validateSignup, validateLogin, handleValidationErrors } from '../validators/authValidators';

const router = express.Router();

router.post('/signup', validateSignup, handleValidationErrors, signupUser);

router.post('/login', validateLogin, handleValidationErrors, loginUser);

export default router;