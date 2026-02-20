#!/bin/bash

# MCARE Deployment Pre-flight Checklist
# Run this script before deploying to verify everything is ready

echo "🚀 MCARE Deployment Pre-flight Check"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "DEPLOYMENT_GUIDE.md" ]; then
    echo "${RED}❌ Error: Please run this script from the MCARE root directory${NC}"
    exit 1
fi

echo "📁 Checking project structure..."
if [ -d "frontend" ] && [ -d "backend" ]; then
    echo "${GREEN}✅ Frontend and Backend directories found${NC}"
else
    echo "${RED}❌ Missing frontend or backend directory${NC}"
    exit 1
fi

echo ""
echo "🔍 Checking frontend configuration..."

# Check frontend .env.example
if [ -f "frontend/.env.example" ]; then
    echo "${GREEN}✅ Frontend .env.example exists${NC}"
else
    echo "${YELLOW}⚠️  Frontend .env.example not found${NC}"
fi

# Check frontend vercel.json
if [ -f "frontend/vercel.json" ]; then
    echo "${GREEN}✅ Frontend vercel.json exists${NC}"
else
    echo "${YELLOW}⚠️  Frontend vercel.json not found${NC}"
fi

# Check frontend build
cd frontend
if npm run build > /dev/null 2>&1; then
    echo "${GREEN}✅ Frontend builds successfully${NC}"
else
    echo "${RED}❌ Frontend build failed - check for errors${NC}"
fi
cd ..

echo ""
echo "🔍 Checking backend configuration..."

# Check backend .env.example
if [ -f "backend/.env.example" ]; then
    echo "${GREEN}✅ Backend .env.example exists${NC}"
else
    echo "${YELLOW}⚠️  Backend .env.example not found${NC}"
fi

# Check backend .env
if [ -f "backend/.env" ]; then
    echo "${GREEN}✅ Backend .env exists${NC}"
    
    # Check for required variables
    if grep -q "DB_HOST" backend/.env && grep -q "DB_NAME" backend/.env; then
        echo "${GREEN}✅ Database configuration found${NC}"
    else
        echo "${YELLOW}⚠️  Missing database configuration in .env${NC}"
    fi
else
    echo "${RED}❌ Backend .env not found - copy from .env.example${NC}"
fi

echo ""
echo "🔍 Checking Git status..."

if [ -d ".git" ]; then
    echo "${GREEN}✅ Git repository initialized${NC}"
    
    # Check if there are uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo "${YELLOW}⚠️  You have uncommitted changes${NC}"
    else
        echo "${GREEN}✅ All changes committed${NC}"
    fi
    
    # Check if remote is configured
    if git remote -v | grep -q "origin"; then
        echo "${GREEN}✅ Git remote 'origin' configured${NC}"
    else
        echo "${RED}❌ No Git remote configured - add your GitHub repository${NC}"
    fi
else
    echo "${RED}❌ Git not initialized - run 'git init'${NC}"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo ""
echo "Before deploying, make sure:"
echo "  1. ✅ Create GitHub repository"
echo "  2. ✅ Push code to GitHub"
echo "  3. ✅ Create Render account for backend"
echo "  4. ✅ Create Vercel account for frontend"
echo "  5. ✅ Have database credentials ready"
echo ""
echo "Next steps:"
echo "  1. Read: ${YELLOW}DEPLOYMENT_GUIDE.md${NC}"
echo "  2. Deploy backend to Render first"
echo "  3. Deploy frontend to Vercel with backend URL"
echo ""
echo "${GREEN}Pre-flight check complete!${NC}"
echo "Good luck with your deployment! 🚀"
