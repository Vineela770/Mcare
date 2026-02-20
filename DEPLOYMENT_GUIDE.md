# 🚀 MCARE Deployment Guide - Vercel

## Overview
This guide will help you deploy the MCARE Healthcare Jobs Platform:
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render.com (Node.js + Express)
- **Database**: Render.com (PostgreSQL)

---

## 📋 Prerequisites

1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. Render account (sign up at https://render.com)
4. Your code pushed to GitHub

---

## Part 1: Deploy Backend to Render

### Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `mcare-database`
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **"Create Database"**
5. **IMPORTANT**: Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 2: Deploy Backend Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `mcare-backend`
   - **Region**: Same as database
   - **Branch**: `main` (or your branch name)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable"
   
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<paste your Internal Database URL from Step 1>
   FRONTEND_URL=https://your-app.vercel.app (we'll update this later)
   JWT_SECRET=mcare-secret-key-2026-production-change-this
   ```

5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment
7. **Copy your backend URL** (e.g., `https://mcare-backend.onrender.com`)

### Step 3: Import Database Schema

1. In Render dashboard, go to your database
2. Click **"Connect"** → **"External Connection"**
3. Copy the connection command
4. On your local machine, export your database:
   ```bash
   pg_dump -U postgres mcare_db > mcare_backup.sql
   ```

5. Import to Render (replace with your credentials):
   ```bash
   psql -h <host> -U <user> -d <database> -p <port> < mcare_backup.sql
   ```

   Or use a GUI like pgAdmin or TablePlus to connect and import.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Push Code to GitHub

```bash
cd /Users/uvineelareddy/Desktop/MCARE
git init
git add .
git commit -m "Initial commit - MCARE Healthcare Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mcare-jobs.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. Select your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   
5. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://mcare-backend.onrender.com` (your backend URL from Part 1)

6. Click **"Deploy"**
7. Wait 2-3 minutes
8. **Copy your Vercel URL** (e.g., `https://mcare-jobs.vercel.app`)

### Step 3: Update Backend FRONTEND_URL

1. Go back to Render dashboard → Your backend service
2. Go to **"Environment"**
3. Update `FRONTEND_URL` to your Vercel URL: `https://mcare-jobs.vercel.app`
4. Click **"Save Changes"**
5. Wait for backend to redeploy (~2 minutes)

---

## Part 3: Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Buy a domain (e.g., Namecheap, GoDaddy)
2. In Vercel project → **"Settings"** → **"Domains"**
3. Add your domain: `www.mcarejobs.com`
4. Follow Vercel's DNS configuration instructions
5. Update `FRONTEND_URL` in Render backend to your custom domain

---

## 🧪 Testing Your Deployment

1. Visit your Vercel URL: `https://mcare-jobs.vercel.app`
2. Test features:
   - ✅ Homepage loads
   - ✅ Job listings show
   - ✅ Search works
   - ✅ Contact form submits
   - ✅ Quick Apply/Post works
   - ✅ Navigation works

3. Check backend health:
   - Visit: `https://mcare-backend.onrender.com`
   - Should see: "MCARE API is running..."

4. Test API:
   - Visit: `https://mcare-backend.onrender.com/api/jobs`
   - Should see: JSON array of jobs

---

## 🐛 Troubleshooting

### Frontend shows "Failed to fetch"
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend is running on Render
- Check browser console for CORS errors

### CORS errors in browser
- Verify `FRONTEND_URL` is set correctly in Render backend
- Make sure it matches your Vercel URL exactly (with https://)

### Database connection error
- Check `DATABASE_URL` in Render backend environment
- Verify database is running in Render dashboard
- Test connection using pgAdmin

### Backend not responding
- Check Render logs: Dashboard → Your service → "Logs"
- Verify `PORT` is set to 3000 in environment variables
- Check if startup command is correct: `node server.js`

---

## 📊 Monitor Your App

### Vercel Analytics
- Go to your project → "Analytics"
- See page views, performance, etc.

### Render Metrics
- Dashboard → Your service → "Metrics"
- See CPU, memory, bandwidth usage

---

## 💰 Cost Breakdown (Free Tier Limits)

### Vercel Free Plan
- ✅ Unlimited websites
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains

### Render Free Plan
- ✅ Web service (sleeps after 15 min inactivity, wakes on request)
- ✅ PostgreSQL 90 days then expires (upgrade to $7/month for persistence)
- ⚠️ First request may be slow (cold start ~30 seconds)

---

## 🔄 Continuous Deployment

Once set up, every time you push to GitHub:
1. Vercel automatically rebuilds frontend
2. Render automatically redeploys backend

```bash
# Make changes to your code
git add .
git commit -m "Updated homepage design"
git push

# Wait 2-3 minutes, changes are live!
```

---

## 🎉 You're Live!

Share your MCARE platform:
- **Website**: https://mcare-jobs.vercel.app
- **Custom Domain**: www.mcarejobs.com (if configured)

---

## Next Steps

1. **SEO**: Add meta tags, sitemap.xml, robots.txt
2. **Analytics**: Set up Google Analytics
3. **Monitoring**: Set up error tracking (Sentry)
4. **Email**: Configure real email service for contact form
5. **Backup**: Set up automatic database backups

---

## Support

If you encounter issues:
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Stack Overflow: https://stackoverflow.com

Good luck with your deployment! 🚀
