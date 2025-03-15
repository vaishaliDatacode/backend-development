const User = require('../models/User');
const crypto = require('crypto');
const { generateToken } = require('../utils/jwtUtils'); 
const { sendEmail } = require('../utils/emailUtils');

// Register new user
const registerUser = async (name, email, password, role) => {
  try {

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Create user
    const newUser = new User({
      name,
      email,
      password,
      role: role || 'User',
    });

    // Generate verification token
    const verificationToken = generateEmailVerificationToken(newUser);
    await newUser.save();

    // Create verification URL
    const verificationURL = `${process.env.CLIENT_URL}/api/auth/verify-email/${verificationToken}`;

    // Send verification email
    try {
      await sendEmail({
        email: newUser.email,
        subject: 'Please verify your email',
        html: `
          <h1>Email Verification</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationURL}" target="_blank">Verify Email</a>
          <p>The link will expire in 24 hours.</p>
        `,
      });

      return {
        success: true,
        userId: newUser._id,
        message: 'User created successfully. Please check your email to verify your account.'
      };
    } catch (error) {
      // If email fails, reset verification token and save
      newUser.emailVerificationToken = undefined;
      newUser.emailVerificationExpires = undefined;
      await newUser.save({ validateBeforeSave: false });

      throw new Error('Error sending verification email. Please try again.');
    }
  } catch (error) {
    throw error;
  }
};

// Generate email verification token
const generateEmailVerificationToken = (user) => {
  // Create random token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  // Hash and set to emailVerificationToken field
  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  // Set expiration (24 hours)
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  
  return verificationToken;
};

// Login user
const loginUser = async (email, password) => {
  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid email or password');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Generate token using your JWT util
    const token = generateToken(user._id, user.role);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    };
  } catch (error) {
    throw error;
  }
};

// Verify email
const verifyEmail = async (token) => {
  try {
    // Hash the token to match stored hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with matching token and not expired
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new Error('Token is invalid or has expired');
    }
    
    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    return { success: true, message: 'Email verified successfully' };
  } catch (error) {
    throw error;
  }
};

// Request password reset
const forgotPassword = async (email) => {
  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('No user with that email');
    }
    
    // Generate token
    const resetToken = generatePasswordResetToken(user);
    await user.save({ validateBeforeSave: false });
    
    // Create reset URL
    const resetURL = `${process.env.CLIENT_URL}/api/auth/reset-password/${resetToken}`;
    
    // Send email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset</h1>
          <p>You requested a password reset. Please click the link below to reset your password:</p>
          <a href="${resetURL}" target="_blank">Reset Password</a>
          <p>The link will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });
      
      return { success: true, message: 'Password reset link sent to email' };
    } catch (error) {
      // If email fails, reset token fields
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      throw new Error('Error sending reset email. Please try again later.');
    }
  } catch (error) {
    throw error;
  }
};

// Generate password reset token
const generatePasswordResetToken = (user) => {
  // Create random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash and set to passwordResetToken field
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // Set expiration (10 minutes)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

// Reset password
const resetPassword = async (token, newPassword) => {
  try {
    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with matching token and not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      throw new Error('Token is invalid or has expired');
    }
    
    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    // Create token for automatic login using your JWT util
    const jwtToken = generateToken(user._id, user.role);
    
    return {
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    throw error;
  }
};

// Resend verification email
const resendVerificationEmail = async (email) => {
  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('No user with that email');
    }
    
    // Check if already verified
    if (user.isEmailVerified) {
      throw new Error('Email already verified');
    }
    
    // Generate new verification token
    const verificationToken = generateEmailVerificationToken(user);
    await user.save({ validateBeforeSave: false });
    
    // Create verification URL
    const verificationURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    
    // Send email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Please verify your email',
        html: `
          <h1>Email Verification</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationURL}" target="_blank">Verify Email</a>
          <p>The link will expire in 24 hours.</p>
        `,
      });
      
      return { success: true, message: 'Verification email sent' };
    } catch (error) {
      // If email fails, reset verification token and save
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      throw new Error('Error sending verification email. Please try again.');
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail
};