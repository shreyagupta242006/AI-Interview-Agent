const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Import Routes
const interviewRoute = require("./routes/interview");
const candidateRoute = require("./routes/candidate");

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Interview Agent Backend Running 🚀",
  });
});

// APIs
app.use("/api/interview", interviewRoute);
app.use("/api/candidates", candidateRoute);

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});