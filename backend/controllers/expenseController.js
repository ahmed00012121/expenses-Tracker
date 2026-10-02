const Expense = require("../models/Expense");
const addTransaction = async (req, res) => {
  try {
    const { type, name, title, amount, category, date, notes, currency, images } = req.body;

    if (!title || !amount || !type || !currency) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const expense = new Expense({
      user: req.user._id,
      type,
      name,
      title,
      amount,
      category,
      date,
      notes,
      currency,
      images: images || [] // Ensure images is an array even if empty
    });
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error("Error in addTransaction:", err.message);
    res.status(500).json({ message: "Error adding transaction", error: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json({ expenses });
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions", error: err.message });
  }
};

module.exports = { addTransaction, getTransactions };
