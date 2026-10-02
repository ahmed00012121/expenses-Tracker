const Expense = require("../models/Expense");
const getDashboardData = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const transactions = await Expense.find({ user: req.user.id });
    const accountsMap = {};
    transactions.forEach((t) => {
      const accountName = t.name?.trim() || "Default Account";
      if (!accountsMap[accountName]) {
        accountsMap[accountName] = {
          name: accountName,
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
        };
      }
      const amount = parseFloat(t.amount) || 0;
      if (t.type === "income") {
        accountsMap[accountName].totalIncome += amount;
      } else if (t.type === "expense") {
        accountsMap[accountName].totalExpense += amount;
      }
      accountsMap[accountName].balance =
        accountsMap[accountName].totalIncome -
        accountsMap[accountName].totalExpense;
    });
    const accounts = Object.values(accountsMap);
    const totalIncome = accounts.reduce((sum, a) => sum + a.totalIncome, 0);
    const totalExpense = accounts.reduce((sum, a) => sum + a.totalExpense, 0);
    const netBalance = totalIncome - totalExpense;
    res.status(200).json({
      accounts,
      totalIncome,
      totalExpense,
      netBalance,
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboardData };
