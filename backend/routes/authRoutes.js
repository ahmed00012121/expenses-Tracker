const express = require("express");
const router = express.Router();
const { loginUser, registerUser, resetPassword } = require("../controllers/authController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Reset password
router.put("/reset-password", resetPassword);

module.exports = router;
