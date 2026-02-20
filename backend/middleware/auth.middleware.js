const jwt = require("jsonwebtoken");
const pool = require("../config/db");

/**
 * 🛡️ Verifies the JWT token and attaches fresh user data to req.user
 * This is the primary 'protect' middleware used in your routes.
 */
const verifyToken = async (req, res, next) => {
  let token;

  // Check for Token in Authorization Header (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(" ")[1];
      
      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mcare_secret_2026');
      
      // 3. Fetch fresh user data from DB 
      // This ensures req.user has the correct role ('candidate' or 'hr')
      const userResult = await pool.query(
        "SELECT id, full_name, email, role FROM users WHERE id = $1", 
        [decoded.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ success: false, message: "User no longer exists" });
      }

      // 4. Attach the DB user to the request object
      // This allows controllers to access req.user.id securely
      req.user = userResult.rows[0]; 
      return next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      
      // Distinguish between expired tokens and invalid tokens
      const message = error.name === 'TokenExpiredError' 
        ? "Session expired, please login again" 
        : "Not authorized, token failed";

      return res.status(401).json({ success: false, message });
    }
  }

  // Handle Missing Token
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};

/**
 * 🚦 Restricts access based on user roles (e.g., 'candidate', 'hr')
 */
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    // Check if req.user exists (set by verifyToken) and has the required role
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: `Access denied. Role '${req.user ? req.user.role : 'None'}' is not authorized.` 
      });
    }
    next();
  };
};

module.exports = { 
  verifyToken, 
  protect: verifyToken, // Exported as 'protect' for use in routes
  authorizeRole 
};