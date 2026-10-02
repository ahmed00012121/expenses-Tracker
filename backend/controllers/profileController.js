const User = require("../models/User");
const bcrypt = require("bcryptjs");
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      gallery: updatedUser.gallery || [],
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};
const addGalleryImages = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.gallery = user.gallery ? user.gallery.concat(req.body.images || []) : req.body.images || [];
    await user.save();
    res.json({ gallery: user.gallery });
  } catch (err) {
    res.status(500).json({ message: "Error updating gallery", error: err.message });
  }
};
module.exports = {
  getProfile,
  updateProfile,
  addGalleryImages,
};
