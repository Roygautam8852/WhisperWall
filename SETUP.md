# WhisperWall Setup Guide

## Prerequisites

Before you start, make sure you have:
- Node.js v14+ installed
- MongoDB installed locally or MongoDB Atlas account
- Google account for OAuth setup
- A code editor (VS Code recommended)

## Step 1: MongoDB Setup

### Option A: Local MongoDB
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install and start MongoDB
3. Verify it's running on `mongodb://localhost:27017`

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update MONGODB_URI in backend/.env with your connection string

## Step 2: Google OAuth Setup

### Get Google OAuth Credentials:

1. Go to https://console.cloud.google.com/
2. Create a new project (e.g., "WhisperWall")
3. Enable Google+ API:
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/auth/google/callback` (development)
     - `http://localhost:3000` (frontend)
   - Copy your Client ID and Client Secret

5. Update your backend/.env:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   ```

6. Update your frontend/.env:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   ```

## Step 3: Backend Installation

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file with your credentials
# (Copy from Step 2 above)

# Start development server
npm run dev
```

Backend will run on http://localhost:5000

## Step 4: Frontend Installation

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file with API URL
# VITE_API_URL=http://localhost:5000
# VITE_GOOGLE_CLIENT_ID=your_client_id

# Start development server
npm run dev
```

Frontend will run on http://localhost:3000

## Step 5: Testing the Application

1. Open http://localhost:3000 in your browser
2. Click "Login with Google" button
3. Complete Google login
4. Click "Confess Now" button
5. Fill in a confession with:
   - Text (minimum 10 characters)
   - Secret code (minimum 4 characters)
   - Category (optional)
   - Hashtags (optional)
6. Post and see your confession appear
7. Try reacting with Like, Love, or Laugh
8. Try editing/deleting your confession with the secret code

## Environment Variables

### Backend (.env)
```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/whisperwall

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Server
PORT=5000
NODE_ENV=development

# Session
SESSION_SECRET=change_this_in_production

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Useful Commands

### Backend
```bash
npm run dev    # Start with nodemon (auto-reload)
npm start      # Start production
npm test       # Run tests (if applicable)
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## Common Issues

### Issue: Google OAuth login redirects to blank page
**Solution:** 
- Check that redirect URL is registered in Google Console
- Verify GOOGLE_CLIENT_ID in frontend .env matches console
- Check that FRONTEND_URL in backend .env is correct

### Issue: MongoDB connection refused
**Solution:**
- Ensure MongoDB is running
- Check MONGODB_URI is correct
- For Atlas, verify connection string and IP whitelist

### Issue: "Cannot POST /confessions" error
**Solution:**
- Check backend server is running on port 5000
- Verify VITE_API_URL in frontend .env
- Check CORS configuration in backend

### Issue: Secret code validation fails
**Solution:**
- Secret codes are hashed automatically
- Enter the original secret code (not hashed)
- Minimum 4 characters required

## Production Deployment

See main README.md for deployment instructions for:
- Heroku (Backend)
- Vercel (Frontend)
- MongoDB Atlas (Database)

## Getting Help

1. Check error messages in browser console (F12)
2. Check backend terminal for API errors
3. Check browser network tab to see API requests
4. Verify all environment variables are set correctly

## Next Steps

After setup is complete:
1. Explore the codebase
2. Customize the UI in `frontend/src/styles/`
3. Add more features as needed
4. Deploy to production when ready

---

Enjoy building WhisperWall! 🎉
