const express = require("express");
const {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrend,
  updateTransaction,
  deleteTransaction,
  clearAllTransactions   // ✅ Add this import
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Existing GET routes
router.get("/summary", protect, getSummary);
router.get("/categories", protect, getCategoryBreakdown);
router.get("/monthly", protect, getMonthlyTrend);

// New PUT & DELETE routes
router.put("/:id", protect, updateTransaction);
router.delete("/:id", protect, deleteTransaction);
router.delete("/", protect, clearAllTransactions);

module.exports = router;
