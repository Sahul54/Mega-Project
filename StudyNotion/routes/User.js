const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const userController = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/auth");

// Routes for Login, Signup, and Authentication

// Authentication routes
router.post("/login", userController.login);
router.post("/signup", userController.signup); // Changed signUP to signup
router.post("/sendotp", userController.sendotp); // Changed sendotp to sendOTP
router.post("/changepassword", auth, userController.changePassword);

// Reset Password routes
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

// Export the router for use in the main application
module.exports = router;
