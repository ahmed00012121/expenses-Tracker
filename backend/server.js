// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

// Load env vars & connect DB
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import API routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const reportRoutes = require("./routes/reportRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dashboardRoutes = require("./routes/dashboard"); 

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", expenseRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes); 


// ✅ Serve static frontend
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// ✅ Map clean routes → HTML files
const htmlFile = (name) => path.join(frontendPath, name);
app.get("/", (req, res) => res.sendFile(htmlFile("login.html")));
app.get("/login", (req, res) => res.sendFile(htmlFile("login.html")));
app.get("/register", (req, res) => res.sendFile(htmlFile("register.html")));
app.get("/dashboard", (req, res) => res.sendFile(htmlFile("dashboard.html")));
app.get("/reports", (req, res) => res.sendFile(htmlFile("reports.html")));
app.get("/profile", (req, res) => res.sendFile(htmlFile("profile.html")));
app.get("/add-expenses", (req, res) => res.sendFile(htmlFile("add-expenses.html")));

// ✅ Catch-all for frontend (must be LAST)
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(htmlFile("login.html"));
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  if (req.originalUrl.startsWith("/api")) {
    return res.status(500).json({ message: "Server error" });
  }
  res.status(500).send("Server error");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
