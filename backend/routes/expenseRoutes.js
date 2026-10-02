// backend/routes/expenseRoutes.js
const express = require("express");
const { addTransaction, getTransactions } = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/transactions → Add new expense/income
router.post("/", protect, addTransaction);

// GET /api/transactions → Get user’s transactions
router.get("/", protect, getTransactions);

module.exports = router;

