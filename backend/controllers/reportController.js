const Expense = require("../models/Expense");
const getSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    const totalAmount = expenses.reduce((acc, item) => acc + item.amount, 0);
    res.json({ totalAmount, totalRecords: expenses.length });
  } catch (err) {
    res.status(500).json({ message: "Error generating summary", error: err.message });
  }
};
const getCategoryBreakdown = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    const breakdown = {};
    expenses.forEach(exp => {
      breakdown[exp.category] = (breakdown[exp.category] || 0) + exp.amount;
    });
    res.json(breakdown);
  } catch (err) {
    res.status(500).json({ message: "Error generating category breakdown", error: err.message });
  }
};
const getMonthlyTrend = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    const monthly = {};
    expenses.forEach(exp => {
      const month = new Date(exp.date).toLocaleString("default", { month: "short", year: "numeric" });
      monthly[month] = (monthly[month] || 0) + exp.amount;
    });
    res.json(monthly);
  } catch (err) {
    res.status(500).json({ message: "Error generating monthly trend", error: err.message });
  }
};
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const expense = await Expense.findOne({ _id: id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: "Transaction not found" });
    Object.assign(expense, updatedData);
    await expense.save();
    res.json({ message: "Transaction updated", expense });
  } catch (err) {
    res.status(500).json({ message: "Error updating transaction", error: err.message });
  }
};
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting transaction", error: err.message });
  }
};
const clearAllTransactions = async (req, res) => {
  try {
    const result = await Expense.deleteMany({ user: req.user._id });
    res.json({
      message: "All transactions deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({
      message: "Error clearing transactions",
      error: err.message
    });
  }
};
module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrend,
  updateTransaction,
  deleteTransaction,
  clearAllTransactions 
};
