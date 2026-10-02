const express = require("express");
const { getProfile, updateProfile, addGalleryImages } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/profile → Get user profile
router.get("/", protect, getProfile);

// PUT /api/profile → Update user profile (name, email, password, avatar)
router.put("/", protect, updateProfile);

// POST /api/profile/gallery → Add/update gallery images
router.post("/gallery", protect, addGalleryImages);

module.exports = router;
