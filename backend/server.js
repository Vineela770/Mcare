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

// Admin routes
const adminUserRoutes = require("./routes/admin/userRoutes");
const adminJobRoutes = require("./routes/admin/jobRoutes");
const adminEmployerRoutes = require("./routes/admin/employerRoutes");
const adminDashboardRoutes = require("./routes/admin/dashboardRoutes");
const adminReportsRoutes = require("./routes/admin/reportsRoutes");
const adminActivityRoutes = require("./routes/admin/activityRoutes");
const adminSettingsRoutes = require("./routes/admin/systemSettingsRoutes");

// HR/Employer routes
const hrDashboardRoutes = require("./routes/HR/dashboardRoutes");
const hrJobsRoutes = require("./routes/HR/jobsRoutes");
const hrApplicationsRoutes = require("./routes/HR/applicationsRoutes");
const hrCandidatesRoutes = require("./routes/HR/candidatesRoutes");
const hrInterviewsRoutes = require("./routes/HR/interviewsRoutes");
const hrMessagesRoutes = require("./routes/HR/messagesRoutes");
const hrProfileRoutes = require("./routes/HR/profileRoutes");

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

// Admin routes
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/employers", adminEmployerRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/reports", adminReportsRoutes);
app.use("/api/admin/activity", adminActivityRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);

// HR/Employer routes
app.use("/api/hr/dashboard", hrDashboardRoutes);
app.use("/api/hr/jobs", hrJobsRoutes);
app.use("/api/hr/applications", hrApplicationsRoutes);
app.use("/api/hr/candidates", hrCandidatesRoutes);
app.use("/api/hr/interviews", hrInterviewsRoutes);
app.use("/api/hr/messages", hrMessagesRoutes);
app.use("/api/hr/profile", hrProfileRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("MCARE API is running...");
});

// 4. Database Connection Test and Auto-Migration
pool
  .query("SELECT NOW()")
  .then(async () => {
    console.log("🐘 PostgreSQL Connected Successfully at:", new Date().toLocaleString());
    console.log("=".repeat(60));
    console.log("STARTING AUTOMATIC DATABASE MIGRATION");
    console.log("=".repeat(60));
    
    // Auto-run database migration
    const migrationSuccess = await runMigration();
    
    console.log("=".repeat(60));
    if (migrationSuccess) {
      console.log("✅ MIGRATION COMPLETED - SERVER READY");
    } else {
      console.log("❌ MIGRATION FAILED - CHECK ERRORS ABOVE");
    }
    console.log("=".repeat(60));
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
