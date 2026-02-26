const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail, emailTemplates } = require("../utils/email.service");
const { OAuth2Client } = require('google-auth-library');

/**
 * @desc Helper to calculate real-time profile completion percentage
 * Synchronized with Resume.jsx (30% Resume, 20% Summary, 25% Exp, 25% Edu)
 */
const calculateCompletion = (profile) => {
  let score = 0;
  
  // 1. Resume Check (30%)
  if (profile.resume_url) score += 30;
  
  // 2. Summary Check (20%) - ✅ Matches frontend threshold (3 chars)
  if (profile.professional_summary && profile.professional_summary.trim().length >= 3) {
    score += 20;
  }
  
  // 3. Experience Check (25%)
  const parseJson = (data) => {
    try {
      if (!data) return [];
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) { return []; }
  };

  const exp = parseJson(profile.experience);
  if (Array.isArray(exp) && exp.length > 0) score += 25;
  
  // 4. Education Check (25%)
  const edu = parseJson(profile.education);
  if (Array.isArray(edu) && edu.length > 0) score += 25;
  
  return score;
};

/**
 * @desc    Register a new user (Doctor/JobSeeker or Employer/Recruiter)
 */
exports.register = async (req, res) => {
  const client = await pool.connect();
  try {
    const { 
      title, fullName, email, password, phone, location, role,
      qualification, designation,
      organizationName, organizationCategory, numberOfBeds, 
      organizationCity, organizationAddress 
    } = req.body;

    // ✅ 1. SECURITY: Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // ✅ 2. SECURITY: Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Check for at least one uppercase, one lowercase, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must contain uppercase, lowercase, number, and special character (@$!%*?&)" 
      });
    }

    // ✅ 3. SECURITY: Phone number validation (basic)
    if (phone && phone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ success: false, message: "Invalid phone number" });
    }

    const normalizedRole = (role === 'candidate' || role?.toLowerCase() === 'doctor') ? 'candidate' : 'hr';

    const userExists = await client.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email.trim()]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    // ✅ 4. SECURITY: Strong password hashing with cost factor 12
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await client.query('BEGIN'); 

    const userResult = await client.query(
      `INSERT INTO users (title, full_name, email, password, phone_number, location, role) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, role, full_name, email`,
      [title, fullName, email.trim(), hashedPassword, phone, location, normalizedRole]
    );
    const newUser = userResult.rows[0];

    if (normalizedRole === 'candidate') {
      const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : null;
      await client.query(
        `INSERT INTO candidate_profiles (user_id, qualification, resume_url) VALUES ($1, $2, $3)`,
        [newUser.id, qualification, resumeUrl]
      );
    } else {
      await client.query(
        `INSERT INTO employer_profiles 
         (user_id, designation, organization_name, organization_category, number_of_beds, organization_city, organization_address) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [newUser.id, designation, organizationName, organizationCategory, numberOfBeds || '0', organizationCity, organizationAddress]
      );
    }

    await client.query('COMMIT'); 

    // ✅ 5. SEND PROFESSIONAL WELCOME EMAIL
    try {
      const { sendEmail, emailTemplates } = require("../utils/email.service");
      const welcomeEmail = emailTemplates.welcome(newUser.full_name, newUser.role);
      await sendEmail(
        newUser.email,
        "🎉 Welcome to MCARE - Registration Successful!",
        welcomeEmail
      );
      console.log(`✅ Welcome email sent to ${newUser.email}`);
    } catch (emailErr) {
      console.warn("⚠️ Registration successful but email failed:", emailErr.message);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: "Registration successful! Check your email for confirmation.",
      user: { 
        id: newUser.id, 
        role: newUser.role,
        displayId: `MCARE-${newUser.id.toString().padStart(3, '0')}` 
      }
    });

  } catch (err) {
    await client.query('ROLLBACK'); 
    console.error("❌ Register Error:", err.message);
    res.status(500).json({ success: false, message: "Server error during registration" });
  } finally {
    client.release();
  }
};

/**
 * @desc    Login user & get token
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Hardcoded admin login (no DB check)
    if (
      email.trim().toLowerCase() === 'vicky23@gmail.com' &&
      password === 'Admin@2026'
    ) {
      const token = jwt.sign(
        { id: 0, role: 'administrator' },
        process.env.JWT_SECRET || 'mcare_secret_2026',
        { expiresIn: "1d" }
      );
      return res.json({
        success: true,
        token,
        user: {
          id: 0,
          displayId: 'ADMIN',
          name: 'Admin User',
          email: email.trim(),
          role: 'administrator',
          profile_completion: 100
        }
      });
    }

    // Query user by email only (role is determined from database)
    const userQuery = `
      SELECT u.*, cp.resume_url, cp.professional_summary, cp.experience, cp.education 
      FROM users u 
      LEFT JOIN candidate_profiles cp ON u.id = cp.user_id 
      WHERE LOWER(u.email) = LOWER($1)
    `;

    const userResult = await pool.query(userQuery, [email.trim()]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Calculate real-time completion based on database fields
    const completionScore = user.role === 'candidate' ? calculateCompletion(user) : 100;

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'mcare_secret_2026',
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: { 
        id: user.id, 
        displayId: `MCARE-${user.id.toString().padStart(3, '0')}`,
        name: user.full_name,
        email: user.email, 
        role: user.role,
        profile_completion: completionScore
      }
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

/**
 * @desc    Change user password (Authenticated)
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
    }

    const userResult = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect current password" });

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ success: false, message: "New password cannot be the same as your current password." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedNewPassword, userId]);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Change Password Error:", err.message);
    res.status(500).json({ success: false, message: "Server error updating password" });
  }
};

/**
 * @desc    Delete user profile/account (Verified)
 */
exports.deleteProfile = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    const userResult = await pool.query("SELECT password FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password. Account deletion denied." });
    }

    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [userId]);

    if (result.rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Server error deleting account" });
  }
};

/**
 * ✅ ADDED: Send Recovery Mail Logic
 * @desc    Handles recovery email request from the Delete Profile page
 */
exports.sendRecoveryMail = async (req, res) => {
    try {
        const { recoveryEmail } = req.body;

        if (!recoveryEmail) {
            return res.status(400).json({ success: false, message: "Recovery email address is required." });
        }

        // 🛠️ INTEGRATION POINT: 
        // You can add your Nodemailer logic here to send a real email.
        console.log(`📩 Recovery link requested for email: ${recoveryEmail}`);

        res.json({ 
            success: true, 
            message: `A recovery link has been successfully initiated for: ${recoveryEmail}. Please check your inbox shortly.` 
        });
    } catch (err) {
        console.error("❌ Recovery Mail Error:", err.message);
        res.status(500).json({ success: false, message: "Failed to process recovery mail request." });
    }
};

/**
 * @desc    Reset Password Placeholders
 */
/**
 * @desc    Send password reset email with token
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if user exists
    const userResult = await pool.query(
      "SELECT id, full_name, email FROM users WHERE LOWER(email) = LOWER($1)",
      [email.trim()]
    );

    if (userResult.rows.length === 0) {
      // For security, don't reveal if email exists or not
      return res.status(200).json({ 
        success: true, 
        message: "If that email exists, a password reset link has been sent" 
      });
    }

    const user = userResult.rows[0];

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token and expiry to database
    await pool.query(
      "UPDATE users SET reset_token = $1, reset_expiry = $2 WHERE id = $3",
      [resetToken, resetExpiry, user.id]
    );

    // Send password reset email
    try {
      await sendEmail(
        user.email,
        "Reset Your MCARE Password",
        emailTemplates.passwordReset(user.full_name, resetToken)
      );

      console.log(`✅ Password reset email sent to ${user.email}`);
    } catch (emailError) {
      console.error("❌ Failed to send password reset email:", emailError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send password reset email. Please try again later." 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Password reset link sent to your email" 
    });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

/**
 * @desc    Reset password using token
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Token and new password are required" 
      });
    }

    // Password validation
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 8 characters long" 
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must contain uppercase, lowercase, number, and special character (@$!%*?&)" 
      });
    }

    // Find user with valid token
    const userResult = await pool.query(
      "SELECT id, email, full_name, reset_expiry FROM users WHERE reset_token = $1",
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired reset token" 
      });
    }

    const user = userResult.rows[0];

    // Check if token has expired
    if (new Date() > new Date(user.reset_expiry)) {
      return res.status(400).json({ 
        success: false, 
        message: "Reset token has expired. Please request a new one." 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    await pool.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_expiry = NULL WHERE id = $2",
      [hashedPassword, user.id]
    );

    console.log(`✅ Password reset successful for ${user.email}`);

    res.status(200).json({ 
      success: true, 
      message: "Password has been reset successfully. You can now log in with your new password." 
    });

  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

/**
 * @route POST /api/auth/google-login
 * @desc Authenticate user via Google OAuth
 */
exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ 
        success: false, 
        message: "Google credential is required" 
      });
    }

    // Verify Google token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    console.log(`🔐 Google login attempt for: ${email}`);

    // Check if user exists
    let userQuery = await pool.query(
      `SELECT u.* FROM users u WHERE LOWER(u.email) = LOWER($1)`,
      [email]
    );

    let user;

    if (userQuery.rows.length === 0) {
      // Create new user with default role 'candidate'
      console.log(`📝 Creating new user from Google OAuth: ${email}`);
      
      const insertResult = await pool.query(
        `INSERT INTO users (email, full_name, role, google_id, profile_photo, email_verified) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [email, name, 'candidate', googleId, picture, true]
      );
      
      user = insertResult.rows[0];
    } else {
      user = userQuery.rows[0];
      
      // Update google_id and profile photo if not set
      if (!user.google_id || !user.profile_photo) {
        await pool.query(
          `UPDATE users SET google_id = $1, profile_photo = $2, email_verified = true 
           WHERE id = $3`,
          [googleId, picture, user.id]
        );
        user.google_id = googleId;
        user.profile_photo = picture;
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || "mcare-secret-key-2024",
      { expiresIn: "1d" }
    );

    console.log(`✅ Google login successful for ${email} as ${user.role}`);

    res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name || user.name,
        role: user.role,
        profilePhoto: user.profile_photo,
      },
    });

  } catch (error) {
    console.error("❌ Google Login Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Google authentication failed. Please try again." 
    });
  }
};

/**
 * @desc    Account Recovery - Send detailed recovery instructions via email
 * @route   POST /api/auth/account-recovery
 */
exports.accountRecovery = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email address is required for account recovery." 
      });
    }

    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, email, full_name, role, created_at FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      // For security, don't reveal if email exists or not
      return res.json({ 
        success: true, 
        message: "If an account exists with this email, recovery instructions have been sent." 
      });
    }

    const user = userResult.rows[0];

    // Generate recovery token
    const recoveryToken = crypto.randomBytes(32).toString('hex');
    const recoveryTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store recovery token in database
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [recoveryToken, recoveryTokenExpiry, user.id]
    );

    // Send recovery email
    const recoveryLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${recoveryToken}`;
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">MCARE Account Recovery</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="color: #1f2937;">Hello ${user.full_name || 'User'},</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            We received a request to help you recover your MCARE account. Here are your account details:
          </p>
          
          <div style="background-color: white; border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
            <p style="margin: 5px 0;"><strong>Account Type:</strong> ${user.role}</p>
            <p style="margin: 5px 0;"><strong>Account Created:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            If you're having trouble accessing your account, you can reset your password using the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${recoveryLink}" 
               style="background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); 
                      color: white; 
                      padding: 15px 40px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;
                      font-weight: bold;">
              Reset Your Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <a href="${recoveryLink}" style="color: #06b6d4; word-break: break-all;">${recoveryLink}</a>
          </p>
          
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>⚠️ Security Note:</strong> This link will expire in 24 hours. If you didn't request this recovery, please ignore this email and your account will remain secure.
            </p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Need more help? Please contact our support team at support@mcarejobs.com
          </p>
          
          <p style="color: #6b7280; margin-top: 30px;">
            Best regards,<br>
            <strong>MCARE Team</strong>
          </p>
        </div>
        
        <div style="background-color: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © 2026 MCARE Healthcare Jobs. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: '🔐 MCARE Account Recovery - Your Account Information',
      html: emailContent,
    });

    console.log(`📧 Account recovery email sent to: ${email}`);

    res.json({ 
      success: true, 
      message: "If an account exists with this email, recovery instructions have been sent." 
    });

  } catch (error) {
    console.error("❌ Account Recovery Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to process account recovery request. Please try again." 
    });
  }
};