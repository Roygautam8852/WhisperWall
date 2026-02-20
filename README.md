# SecretDiary - Anonymous Confession Platform

A production-level MERN stack application for sharing anonymous confessions with reactions and community engagement.

## 🌟 Features

- **Google OAuth 2.0 Authentication** - Secure login using Google accounts
- **Anonymous Confessions** - Post confessions with a secret code for future edits/deletes
- **Reactions System** - Like, Love, and Laugh reactions on confessions
- **Category System** - Organize confessions (General, Crush, Study, Funny, Rant)
- **Hashtags** - Add hashtags to confessions for better organization
- **Filtering & Sorting** - Find confessions by category and sort by newest/trending
- **Secret Code Protection** - Secure edit and delete with encrypted secret codes
- **User Anonymity** - Display anonymous usernames (Anon#XXXX)
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Beautiful glassmorphism design with smooth animations
- **Rate Limiting** - Prevent spam with smart rate limiting
- **Input Validation** - Comprehensive validation on all endpoints

## 🚀 Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- Passport.js (Google OAuth)
- Bcryptjs (Password hashing)
- Joi (Input validation)
- Express Rate Limit

**Frontend:**
- React 18
- React Router v6
- Vite
- Framer Motion (Animations)
- Axios
- Lucide Icons

## 📁 Folder Structure

```
secretdiary/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── passport.js        # Google OAuth strategy
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── confessionController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Confession.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── confessions.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ConfessionCard.jsx
│   │   │   ├── ConfessionModal.jsx
│   │   │   └── Filters.jsx
│   │   ├── pages/
│   │   │   └── HomePage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── index.html
│   ├── package.json
│   └── .env
├── .gitignore
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js v14 or higher
- MongoDB local or MongoDB Atlas connection
- Google OAuth 2.0 credentials

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (update with your values)
   ```bash
   MONGODB_URI=mongodb://localhost:27017/secretdiary
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   PORT=5000
   NODE_ENV=development
   SESSION_SECRET=your_session_secret_here
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start backend server**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   VITE_API_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   App will run on http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints

- **GET** `/auth/google` - Redirect to Google OAuth
- **GET** `/auth/google/callback` - OAuth callback
- **GET** `/auth/me` - Get current user
- **POST** `/auth/logout` - Logout user

### Confession Endpoints

- **GET** `/confessions` - Get all confessions
  - Query params: `sortBy` (newest/trending), `category` (All/Crush/Study/etc)
  
- **GET** `/confessions/:id` - Get single confession

- **POST** `/confessions` - Create new confession (requires auth)
  ```json
  {
    "text": "Your confession text...",
    "secretCode": "1234",
    "category": "Crush",
    "hashtags": ["love", "crush"]
  }
  ```

- **PUT** `/confessions/:id` - Update confession (requires auth + secret code)
  ```json
  {
    "text": "Updated text...",
    "secretCode": "new_code",
    "currentSecretCode": "1234",
    "category": "Crush",
    "hashtags": ["love"]
  }
  ```

- **DELETE** `/confessions/:id` - Delete confession (requires auth + secret code)
  ```json
  {
    "secretCode": "1234"
  }
  ```

- **POST** `/confessions/:id/react` - Add reaction (requires auth)
  ```json
  {
    "reactionType": "like" | "love" | "laugh"
  }
  ```

- **GET** `/confessions/user/confessions/my` - Get user's confessions (requires auth)

## 🔐 Security Features

- ✅ Google OAuth 2.0 authentication
- ✅ Bcryptjs for secret code hashing
- ✅ Input validation with Joi
- ✅ Rate limiting (10 confessions per 15 mins)
- ✅ CORS configuration
- ✅ HTTP-only session cookies
- ✅ Secure MongoDB connections
- ✅ Environment variables for sensitive data

## 🎨 UI Components

### Navbar
- Sticky navigation with logo
- Google login button
- User profile display
- Confess button
- Logout functionality

### Confession Card
- User avatar and anonymous name
- Confession text with hashtags
- Category badge
- Timestamp
- Reaction buttons (Like, Love, Laugh)
- Edit/Delete buttons (for own confessions)
- Report button

### Confession Modal
- Text input (10-2000 characters)
- Secret code input
- Category selection
- Hashtag input
- Character counter
- Form validation

### Filters
- Category filter buttons
- Sort options (Newest/Trending)
- Responsive layout

## 🚀 Deployment

### Backend Deployment (Heroku)

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set GOOGLE_CLIENT_ID=your_google_client_id
   heroku config:set GOOGLE_CLIENT_SECRET=your_google_client_secret
   # ... other env vars
   ```
5. Deploy: `git push heroku main`

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. From frontend directory: `vercel`
3. Follow prompts and connect your repo
4. Set environment variable: `VITE_API_URL=your_backend_url`

### Database Deployment

1. Create MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in backend .env

## 📱 Responsive Design

- Mobile-first approach
- Optimized for phones (320px+)
- Tablet support (768px+)
- Desktop optimization (1024px+)
- Touch-friendly buttons and inputs

## 🎯 Features Not Yet Implemented (Future)

- [ ] Profanity filter
- [ ] Report confession system
- [ ] Trending confessions algorithm
- [ ] User dashboard
- [ ] Reply/Comments on confessions
- [ ] Dark/Light theme toggle
- [ ] Email notifications
- [ ] Admin dashboard

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running locally or use MongoDB Atlas
- Check connection string in .env

**Google OAuth Not Working**
- Verify Client ID and Secret
- Check redirect URL matches exactly
- Ensure CORS is properly configured

**CORS Errors**
- Backend CORS is configured for frontend
- Check FRONTEND_URL in backend .env

**Port Already in Use**
- Backend: `lsof -i :5000` and `kill -9 <PID>`
- Frontend: `lsof -i :3000` and `kill -9 <PID>`

## 📄 License

MIT License - feel free to use this project

## 👨‍💻 Author

Built with ❤️ for the community

## 📞 Support

For issues or questions, please open an issue on the repository.

---

**Happy Confessing! 🤫**
