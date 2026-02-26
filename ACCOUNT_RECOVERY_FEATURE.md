# 🔐 Account Recovery Feature - Documentation

## Overview
The account recovery feature allows users who cannot access their account to request recovery instructions via email. This is different from "Forgot Password" - it provides comprehensive account information and a password reset link.

---

## 🎨 User Interface

### Login Page Updates
- **Location:** Below "Forgot password?" link
- **New Link:** "Recovery account?"
- **Layout:** Both links are stacked vertically on the right side

### Recovery Form Fields
1. **Email Input:** User enters their registered email
2. **Information Note:** Explains what will be sent
3. **Submit Button:** "Send Recovery Email"
4. **Back Button:** Returns to login form

---

## 🔄 How It Works

### User Flow
1. User clicks "Recovery account?" on login page
2. Account Recovery form appears
3. User enters their email address
4. User clicks "Send Recovery Email"
5. Email sent with:
   - Account details (email, role, creation date)
   - Password reset link (24-hour validity)
   - Security information

### Backend Process
1. Check if email exists in database
2. Generate secure recovery token (32-byte random hex)
3. Store token and expiry (24 hours) in database
4. Send detailed recovery email
5. Return success message (doesn't reveal if email exists for security)

---

## 📧 Email Content

The recovery email includes:

### Account Information
- Registered email address
- Account type (Candidate/HR/Admin)
- Account creation date

### Password Reset
- Secure reset link (24-hour validity)
- Button and text link format
- Security warning about link expiry

### Additional Help
- Support email: support@mcarejobs.com
- Professional MCARE branding
- Security notes and warnings

---

## 🔧 Technical Implementation

### Frontend Files Modified
- **File:** `frontend/src/pages/common/Login.jsx`
- **Changes:**
  - Added `isAccountRecovery` state
  - Added `recoveryEmail`, `recoveryMessage`, `recoveryLoading` states
  - Created `handleAccountRecovery` function
  - Added account recovery form UI
  - Added "Recovery account?" link in login form

### Backend Files Modified

#### 1. Controller
- **File:** `backend/controllers/auth.controller.js`
- **Function:** `exports.accountRecovery`
- **Endpoint:** `POST /api/auth/account-recovery`

#### 2. Routes
- **File:** `backend/routes/HR/auth.routes.js`
- **Route:** `router.post("/account-recovery", authController.accountRecovery)`

#### 3. Database
- **Table:** `users`
- **New Column:** `reset_token_expiry` (TIMESTAMP)
- **Existing Column:** `reset_token` (TEXT)

---

## 🧪 Testing

### Local Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Steps:**
   - Go to http://localhost:5173/login
   - Click "Recovery account?"
   - Enter a registered email
   - Click "Send Recovery Email"
   - Check console for email log (or check actual email inbox if configured)

### API Testing with curl

```bash
# Test account recovery endpoint
curl -X POST http://localhost:3000/api/auth/account-recovery \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Expected response:
{
  "success": true,
  "message": "If an account exists with this email, recovery instructions have been sent."
}
```

---

## 🔒 Security Features

1. **Token Security:**
   - 32-byte cryptographically secure random token
   - 24-hour expiration
   - One-time use (invalidated after password reset)

2. **Email Privacy:**
   - Doesn't reveal if email exists in system
   - Same success message for existing and non-existing emails

3. **Rate Limiting:**
   - Consider adding rate limiting to prevent abuse
   - Suggested: Max 3 requests per hour per IP

4. **Link Expiry:**
   - Recovery links expire after 24 hours
   - Clear warning in email about expiration

---

## 📊 Database Schema

### Users Table Columns
```sql
-- Existing
reset_token TEXT

-- Added
reset_token_expiry TIMESTAMP

-- Usage
UPDATE users 
SET reset_token = 'generated_token',
    reset_token_expiry = NOW() + INTERVAL '24 hours'
WHERE email = 'user@example.com';
```

---

## 🚀 Deployment Notes

### Environment Variables Required
```env
# Frontend (.env)
VITE_API_URL=https://your-backend-url.com

# Backend (.env)
FRONTEND_URL=https://your-frontend-url.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Email Service Setup
1. Configure SMTP settings in `backend/.env`
2. For Gmail:
   - Enable 2-factor authentication
   - Generate app-specific password
   - Use app password in EMAIL_PASSWORD

3. For production, consider:
   - SendGrid
   - AWS SES
   - Mailgun

---

## 🎯 Feature Differences

### Forgot Password vs Account Recovery

| Feature | Forgot Password | Account Recovery |
|---------|----------------|------------------|
| Purpose | Reset password only | Full account help |
| Email Content | Just reset link | Account details + reset link |
| Use Case | User knows email, forgot password | User lost access, needs help |
| Recovery Info | None | Email, role, creation date |
| Security Notes | Basic | Comprehensive |

---

## 📝 Future Enhancements

1. **Multi-factor Authentication:**
   - Add phone number verification
   - Send OTP for additional security

2. **Account Verification:**
   - Security questions
   - Alternative email verification

3. **Activity Log:**
   - Track recovery attempts
   - Alert on suspicious activity

4. **Custom Recovery Options:**
   - Multiple recovery methods
   - Admin-assisted recovery for special cases

---

## 🐛 Troubleshooting

### Email Not Sending
- Check EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD in `.env`
- Verify SMTP settings
- Check spam/junk folder
- Enable "Less secure app access" for Gmail (development only)

### Token Not Working
- Check `reset_token_expiry` column exists
- Verify token hasn't expired (24 hours)
- Ensure frontend FRONTEND_URL is correct

### Form Not Showing
- Clear browser cache
- Check console for React errors
- Verify all state variables are defined

---

## 📞 Support

For issues or questions:
- Email: support@mcarejobs.com
- Check backend logs for detailed error messages
- Review browser console for frontend errors

---

## ✅ Checklist

- [x] Frontend account recovery form created
- [x] Backend API endpoint implemented
- [x] Email template designed
- [x] Database schema updated
- [x] Route added to auth.routes.js
- [x] Security measures implemented
- [x] Documentation completed

**Status:** ✅ Feature is ready for testing and deployment

---

*Last Updated: February 20, 2026*
*Version: 1.0*
