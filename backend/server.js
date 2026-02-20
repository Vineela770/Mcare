const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const pool = require("./config/db"); 

// 1. Import your routes
const authRoutes = require("./routes/HR/auth.routes");
const candidateRoutes = require("./routes/HR/candidate.routes");
const jobRoutes = require("./routes/HR/job.routes");
const applicationRoutes = require("./routes/HR/application.routes");
const guestRoutes = require("./routes/HR/guest.routes");
const statsRoutes = require("./routes/HR/stats.routes");
const supportRoutes = require("./routes/HR/support.routes");

// 2. INITIALIZE the app
const app = express();

// 3. MIDDLEWARE
// Allow requests from frontend (localhost + production)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174", 
  "http://localhost:5175",
  process.env.FRONTEND_URL, // Your Vercel URL
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or curl)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list or matches Vercel pattern
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
}));

// Enable JSON parsing to read multi-role registration and login data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 📂 STATIC FILES
 * This line allows the frontend to access candidate resumes and profile photos.
 * Example: If DB has "/uploads/profile_photos/image.png", 
 * the browser will fetch it from http://localhost:3000/uploads/profile_photos/image.png
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 4. LINK ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/support", supportRoutes);

// Basic Health Check
app.get("/", (req, res) => {
    res.send("MCARE API is running...");
});

/**
 * 🐘 DATABASE CONNECTIVITY CHECK
 * Verifies the connection to PostgreSQL before the server starts fully.
 */
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log(`🐘 PostgreSQL Connected Successfully at: ${new Date()}`);
    }
});

/**
 * 🛠️ GLOBAL ERROR HANDLING
 * Catches all unexpected errors to prevent the server from crashing.
 */
app.use((err, req, res, next) => {
    console.error("❌ Global Error Stack:", err.stack);
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || "Internal Server Error" 
    });
});

// 5. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ MCARE Server running on port ${PORT}`);
    console.log(`💬 API Base URL: http://localhost:${PORT}/api`);
});