const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  name: { type: String },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  currency: { type: String, default: "USD" },
  images: { type: [String], default: [] } // <-- new field to store image URLs/Base64
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
