# 🚀 Quick Deployment Commands

## Before You Start

1. **Check if everything is ready:**
   ```bash
   ./deploy-preflight.sh
   ```

## Step 1: Push to GitHub

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for deployment"

# Create GitHub repository at https://github.com/new
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/mcare-jobs.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to https://render.com
2. Create PostgreSQL database
3. Create Web Service
4. Connect GitHub repo
5. Set Root Directory: `backend`
6. Add environment variables from `backend/.env.example`
7. Deploy!

**Your backend URL:** `https://mcare-backend.onrender.com`

## Step 3: Deploy Frontend to Vercel

### Option A: Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Link to existing project? No
# - What's your project's name? mcare-jobs
# - In which directory is your code located? ./
# - Want to override settings? No

# Add environment variable
vercel env add VITE_API_URL production
# Enter value: https://mcare-backend.onrender.com

# Deploy to production
vercel --prod
```

### Option B: Vercel Dashboard (Easier for beginners)

1. Go to https://vercel.com/new
2. Import GitHub repository
3. Framework: **Vite**
4. Root Directory: **frontend**
5. Add Environment Variable:
   - `VITE_API_URL` = `https://mcare-backend.onrender.com`
6. Click **Deploy**

**Your frontend URL:** `https://mcare-jobs.vercel.app`

## Step 4: Update Backend CORS

1. Go to Render backend → Environment
2. Update `FRONTEND_URL` to your Vercel URL
3. Save changes

## ✅ Verify Deployment

```bash
# Test backend
curl https://mcare-backend.onrender.com

# Test API
curl https://mcare-backend.onrender.com/api/jobs

# Open frontend in browser
open https://mcare-jobs.vercel.app
```

## 🔄 Update App After Changes

```bash
# Make your changes
git add .
git commit -m "Updated feature X"
git push

# Both frontend and backend will auto-deploy!
# Wait 2-3 minutes
```

## 📱 Share Your Website

Your MCARE platform is live at:
- **Frontend:** https://mcare-jobs.vercel.app
- **Backend API:** https://mcare-backend.onrender.com/api

## 🆘 Common Issues

### "Cannot connect to backend"
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend is running on Render

### "CORS error"
- Update `FRONTEND_URL` in Render backend
- Must match your Vercel URL exactly

### "Database error"
- Check `DATABASE_URL` in Render backend
- Verify database is running

### "502 Bad Gateway" on first load
- Render free tier sleeps after 15 minutes
- First request takes 30-60 seconds to wake up
- Subsequent requests are fast

## 📚 Full Documentation

For detailed step-by-step guide, see: **DEPLOYMENT_GUIDE.md**

---

🎉 **Happy Deploying!**
