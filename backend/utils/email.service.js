const nodemailer = require("nodemailer");
const dns = require('dns');

// Force IPv4 resolution globally for this module
dns.setDefaultResultOrder('ipv4first');

/**
 * 📧 Professional Email Templates for MCARE
 */

const emailTemplates = {
  /**
   * Welcome Email Template for New Registration
   */
  welcome: (userName, userRole) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to MCARE</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header with Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                  <div style="background-color: white; width: 80px; height: 80px; border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #06b6d4; font-size: 48px; font-weight: bold;">M</span>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Welcome to MCARE!</h1>
                  <p style="margin: 10px 0 0; color: #e0f2fe; font-size: 16px;">Your Healthcare Career Partner</p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px; line-height: 1.6;">
                    Dear <strong>${userName}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    🎉 Congratulations! Your MCARE account has been successfully created as a <strong>${userRole === 'candidate' ? 'Healthcare Professional' : 'Employer/Recruiter'}</strong>.
                  </p>

                  <div style="background: linear-gradient(135deg, #ecfeff 0%, #dbeafe 100%); border-left: 4px solid #06b6d4; padding: 20px; border-radius: 8px; margin: 30px 0;">
                    <p style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: bold;">
                      🚀 What's Next?
                    </p>
                    ${userRole === 'candidate' ? `
                      <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                        <li>Complete your professional profile</li>
                        <li>Upload your latest resume and certifications</li>
                        <li>Browse and apply for healthcare positions</li>
                        <li>Set up job alerts for your preferences</li>
                      </ul>
                    ` : `
                      <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                        <li>Complete your organization profile</li>
                        <li>Post your first job opening</li>
                        <li>Search for qualified healthcare professionals</li>
                        <li>Manage applications efficiently</li>
                      </ul>
                    `}
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                       style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(6, 182, 212, 0.3);">
                      Login to Your Account
                    </a>
                  </div>

                  <p style="margin: 30px 0 20px; color: #4b5563; font-size: 15px; line-height: 1.6;">
                    If you have any questions or need assistance, our support team is here to help!
                  </p>

                  <p style="margin: 0; color: #1f2937; font-size: 16px;">
                    Best regards,<br>
                    <strong>The MCARE Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                    © ${new Date().getFullYear()} MCARE Jobs. All rights reserved.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                    This is an automated message. Please do not reply to this email.
                  </p>
                  <div style="margin-top: 15px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #06b6d4; text-decoration: none; font-size: 13px; margin: 0 10px;">Visit Website</a>
                    <span style="color: #d1d5db;">|</span>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/support" style="color: #06b6d4; text-decoration: none; font-size: 13px; margin: 0 10px;">Support</a>
                    <span style="color: #d1d5db;">|</span>
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/privacy" style="color: #06b6d4; text-decoration: none; font-size: 13px; margin: 0 10px;">Privacy Policy</a>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,

  /**
   * Password Reset Email Template
   */
  passwordReset: (userName, resetToken) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔒 Password Reset Request</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #1f2937; font-size: 16px;">
                    Hi <strong>${userName}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 20px; color: #4b5563; font-size: 15px; line-height: 1.6;">
                    We received a request to reset your MCARE account password. Click the button below to create a new password:
                  </p>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}" 
                       style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Reset Password
                    </a>
                  </div>

                  <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                      ⚠️ <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.
                    </p>
                  </div>

                  <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px;">
                    If the button doesn't work, copy and paste this link:<br>
                    <span style="color: #06b6d4; word-break: break-all;">${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}</span>
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #9ca3af; font-size: 13px;">© ${new Date().getFullYear()} MCARE Jobs. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
};

/**
 * 📨 Enhanced Email Service with HTML Support
 */
const sendEmail = async (to, subject, htmlContent, textContent = '') => {
  try {
    // Support both EMAIL_USER and MAIL_USER
    const emailUser = process.env.EMAIL_USER || process.env.MAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    // Validate email configuration
    if (!emailUser || !emailPass) {
      console.warn("⚠️ Email service not configured - skipping email to", to);
      return null;
    }

    // Force IPv4 by using explicit IPv4 address and settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      family: 4, // ✅ Force IPv4
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      logger: process.env.NODE_ENV === 'development',
      debug: process.env.NODE_ENV === 'development',
    });

    const mailOptions = {
      from: `"MCARE Jobs" <${emailUser}>`,
      to,
      subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, ''), // Fallback plain text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email sending failed to ${to}:`, error.message);
    // ✅ Don't throw error - let registration continue even if email fails
    console.warn(`⚠️ Email sending failed: ${error.message}`);
    return null;
  }
};

module.exports = { sendEmail, emailTemplates };