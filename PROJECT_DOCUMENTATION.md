# WhisperWall - Official Project Documentation

## 1. Project Overview
**WhisperWall** is a modern, anonymous confession platform designed for campus communities. It allows users to share thoughts, secrets, and "vibe" checks without revealing their true identity, while still maintaining a secure and moderated environment through session-based authentication.

---

## 2. Technology Stack & Rationale

### Frontend: React.js (Vite)
- **Why?** React provides a virtual DOM that makes the "Feed" feel instantaneous. When a user reacts to a post, only that specific card updates without refreshing the page. Vite was used for its extremely fast development server and build times.
- **Styling**: Vanilla CSS with **Glassmorphism**. This creates a premium, high-end SaaS feel using `backdrop-filter: blur()`.

### Backend: Node.js & Express.js
- **Why?** JavaScript throughout the stack (Full-stack JS) allows for faster development. Express is the industry standard for building robust RESTful APIs.

### Database: MongoDB & Mongoose
- **Why?** Confessions are "unstructured" data. One post might have 10 hashtags and 50 reactions, another might have none. MongoDB handles this flexible schema much better than traditional SQL databases.

### Security & Auth: Passport.js & Bcrypt
- **Why?** Passport handles the complex "session" logic (cookies). Bcrypt ensures that even the developers cannot see the users' passwords or the "Secret Codes" attached to confessions.

---

## 3. Key Features

1. **Anonymous Identity**: Every user is assigned a random `Anon#XXXX` tag.
2. **Confession Vibe System**: Categories like *Crush*, *Study*, *Funny*, and *Rant* allow for easy filtering.
3. **Secret Code Protection**: Users set a 4-digit code per post. Even if someone steals your phone, they can't delete your post without that code.
4. **Interactive Reactions**: Dynamic "Like", "Love", and "Laugh" counters.
5. **Session Persistence**: Users stay logged in across tabs thanks to secure HTTP-only cookies.

---

## 4. API Architecture

### Authentication
- `POST /auth/signup`: Registers user and hashes password.
- `POST /auth/login`: Validates credentials and initializes session.
- `GET /auth/me`: Verifies the session cookie and returns user data.

### Confessions
- `GET /confessions`: Fetches public feed with sorting logic.
- `POST /confessions`: Creates a post (Protected by Auth middleware).
- `DELETE /confessions/:id`: Deletes a post (Protected by Auth + Secret Code).

---

## 5. Security Measures
- **Rate Limiting**: Prevents bots from spamming confessions.
- **CORS Protection**: Ensures only the official frontend can communicate with the API.
- **Sanitization**: Uses Joi validation on the backend to prevent malicious scripts from being injected into confessions.

---

## 6. How to Run
1. **Backend**: `cd backend && npm install && npm run dev`
2. **Frontend**: `cd frontend && npm install && npm run dev`
3. **Env Files**: Ensure `.env` contains `MONGO_URI` and `SESSION_SECRET`.

---
*Created for the Minor Project Submission - 2026*
