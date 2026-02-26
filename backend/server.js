const express = require("express");
const cors = require("cors");
const path = require("path");

// ✅ Only load .env in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const pool = require("./config/db");
const runMigration = require("./migrate-database");

// 1. Import routes
const authRoutes = require("./routes/HR/auth.routes");
const candidateRoutes = require("./routes/HR/candidate.routes");
const jobRoutes = require("./routes/HR/job.routes");
const applicationRoutes = require("./routes/HR/application.routes");
const guestRoutes = require("./routes/HR/guest.routes");
const statsRoutes = require("./routes/HR/stats.routes");
const supportRoutes = require("./routes/HR/support.routes");

const app = express();

// 2. CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/support", supportRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("MCARE API is running...");
});

// 4. Database Connection Test and Auto-Migration
pool
  .query("SELECT NOW()")
  .then(async () => {
    console.log("🐘 PostgreSQL Connected Successfully!");
    
    // Auto-run database migration
    await runMigration();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:");
    console.error(err.message);
  });

// 5. Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 6. Start Server
const PORT = process.env.PORT || 3000;

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
    : `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`✅ MCARE Server running on port ${PORT}`);
  console.log(`💬 API Base URL: ${BASE_URL}/api`);
});
