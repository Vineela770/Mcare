# Google OAuth Setup Guide

## 🎯 Overview
This guide will help you set up Google OAuth for the "Continue with Google" login feature.

## 📋 Prerequisites
- A Google account
- Access to Google Cloud Console

## 🚀 Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name: `MCARE` (or your preferred name)
4. Click **Create**

### 2. Enable Google OAuth API

1. In your project, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Click **Create**
4. Fill in required fields:
   - App name: `MCARE Job Portal`
   - User support email: `your-email@gmail.com`
   - Developer contact: `your-email@gmail.com`
5. Click **Save and Continue**
6. Skip **Scopes** section (click **Save and Continue**)
7. Add test users (your email addresses for testing)
8. Click **Save and Continue**

### 3. Create OAuth 2.0 Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Select **Application type**: Web application
4. Name: `MCARE Web Client`
5. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
6. Under **Authorized redirect URIs**, you can leave this empty for now
7. Click **Create**
8. **IMPORTANT**: Copy the **Client ID** (it looks like: `xxxxx-xxxxx.apps.googleusercontent.com`)

### 4. Configure Environment Variables

#### Backend (.env)
1. Open `/backend/.env`
2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID:
   ```env
   GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
   ```

#### Frontend (.env)
1. Open `/frontend/.env`
2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with the SAME Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
   ```

### 5. Restart Servers

```bash
# Restart backend
lsof -ti:3000 | xargs kill -9
cd backend && npm start

# Restart frontend (in new terminal)
cd frontend && npm run dev
```

### 6. Test Google Login

1. Open `http://localhost:5173`
2. Click **Continue with Google**
3. You should see Google's sign-in page
4. Select your Google account
5. You'll be redirected back and logged in automatically

## 🔒 Security Notes

- The Client ID is public and can be safely committed to git
- NEVER commit the Client Secret (not needed for this flow)
- For production, add your production domain to Authorized JavaScript origins
- Change OAuth consent screen to "Production" before go-live

## 🛠️ Troubleshooting

### "Error: redirect_uri_mismatch"
- Make sure `http://localhost:5173` is added to Authorized JavaScript origins
- No trailing slash in the URL

### "Error: idpiframe_initialization_failed"
- Clear browser cookies
- Try in incognito mode
- Check if third-party cookies are enabled

### Google button doesn't appear
- Check browser console for errors
- Verify VITE_GOOGLE_CLIENT_ID is set correctly
- Restart frontend server after changing .env

### "Google authentication failed"
- Check backend logs
- Verify GOOGLE_CLIENT_ID matches in both frontend and backend
- Ensure backend has google-auth-library installed

## 📚 Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/gsi/web/guides/overview)
- [React OAuth Google](https://www.npmjs.com/package/@react-oauth/google)

## ✅ What Happens Behind the Scenes

1. User clicks "Continue with Google"
2. Google OAuth popup opens
3. User selects their Google account
4. Google returns a JWT credential token
5. Frontend sends credential to backend `/api/auth/google-login`
6. Backend verifies token with Google servers
7. Backend checks if user exists in database:
   - **New user**: Creates account with role='candidate'
   - **Existing user**: Logs them in
8. Backend returns JWT token + user data
9. Frontend stores token and redirects to appropriate dashboard

## 🎉 Done!

Your Google OAuth is now configured. Users can sign in with their Google accounts!
