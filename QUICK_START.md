# Quick Start Guide - WhisperWall

## ⚡ 5-Minute Setup

### Step 1: Prerequisites
- Node.js v14+ installed
- MongoDB running locally (or MongoDB Atlas account)
- Google OAuth credentials created

### Step 2: Get Google Credentials (5 minutes)

1. Go to https://console.cloud.google.com/
2. Create new project → "WhisperWall"
3. Search "Google+ API" → Enable
4. Go to Credentials → Create OAuth Client ID → Web application
5. Add redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy your **Client ID** and **Client Secret**

### Step 3: Setup Backend

```bash
cd backend
npm install

# Create .env file with this content:
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/whisperwall
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
PORT=5000
NODE_ENV=development
SESSION_SECRET=my_session_secret_key
FRONTEND_URL=http://localhost:3000
EOF

npm run dev
```

Backend will run on: **http://localhost:5000**

### Step 4: Setup Frontend (new terminal)

```bash
cd frontend
npm install

# Create .env file:
cat > .env << EOF
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_client_id_here
EOF

npm run dev
```

Frontend will run on: **http://localhost:3000**

### Step 5: Test It Out

1. Open http://localhost:3000
2. Click "Login with Google"
3. Complete Google login
4. Click "Confess Now"
5. Fill in a confession
6. Post and enjoy!

---

## ✅ Verification Checklist

- [ ] Node v14+ installed: `node --version`
- [ ] MongoDB running: `mongo` or check MongoDB Atlas
- [ ] Google credentials obtained
- [ ] Backend .env configured
- [ ] Frontend .env configured
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can login with Google
- [ ] Can create confession
- [ ] Can see reactions

---

## 🆘 Troubleshooting

**"Cannot connect to MongoDB"**
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas connection string in .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/whisperwall
```

**"Google login not working"**
- Verify Client ID in frontend .env
- Check redirect URL in Google Console
- Ensure CORS is configured

**"Port 5000 already in use"**
```bash
# Kill process
lsof -i :5000
kill -9 <PID>

# Or change PORT in backend .env
```

**"Module not found errors"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Important Files

Backend:
- `backend/server.js` - Main server
- `backend/.env` - Configuration (you create this)
- `backend/config/db.js` - MongoDB connection

Frontend:
- `frontend/src/App.jsx` - Main app
- `frontend/.env` - Configuration (you create this)
- `frontend/src/pages/HomePage.jsx` - Main page

---

## 📚 Full Documentation

- **[README.md](README.md)** - Complete overview
- **[SETUP.md](SETUP.md)** - Detailed setup
- **[API_DOCS.md](API_DOCS.md)** - All API endpoints
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment

---

## 🎯 Next Steps After Setup

1. Create a few test confessions
2. Try editing/deleting with secret codes
3. Test reactions (like, love, laugh)
4. Filter by categories
5. Sort by trending
6. Read through code to understand structure
7. Customize styling in `src/styles/global.css`
8. Deploy to production!

---

## 🚀 Production Deployment

When ready to deploy:

1. Get production MongoDB URI
2. Create production Google OAuth credentials
3. Update environment variables
4. Follow [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 💬 Key Commands

```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev

# Start just backend
npm run dev:backend

# Start just frontend
npm run dev:frontend

# Build frontend for production
cd frontend && npm run build

# Start production backend
cd backend && npm start
```

---

## 🎨 Interface Screenshots

### Navbar
- Purple gradient background
- "Confess Now" button
- User profile with avatar
- Logout button

### Confession Card
- User avatar + anonymous name
- Confession text
- Category badge
- Reaction buttons with counts
- Edit/Delete buttons

### Modal
- Text input with character counter
- Secret code input
- Category dropdown
- Hashtags input
- Submit button

---

That's it! You're ready to confess! 🤫

For detailed documentation, see [README.md](README.md)
