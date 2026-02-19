# WhisperWall API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require the user to be logged in via Google OAuth.
Sessions are maintained using HTTP-only cookies.

---

## Authentication Endpoints

### 1. Google OAuth Login
- **Method:** GET
- **Path:** `/auth/google`
- **Description:** Redirects user to Google OAuth consent screen
- **Authentication:** Not required
- **Returns:** Redirects to Google login page

```bash
# Usage
window.location.href = 'http://localhost:5000/auth/google'
```

### 2. Google OAuth Callback
- **Method:** GET
- **Path:** `/auth/google/callback`
- **Description:** Google OAuth callback - handled automatically
- **Query Parameter:** `code` (provided by Google)
- **Returns:** Redirects to frontend dashboard if successful

### 3. Get Current User
- **Method:** GET
- **Path:** `/auth/me`
- **Authentication:** Required
- **Returns:** Current user object

**Response (200 OK):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@gmail.com",
    "name": "John Doe",
    "avatar": "https://...",
    "displayName": "Anon#5234"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "error": "Not authenticated"
}
```

### 4. Logout
- **Method:** POST
- **Path:** `/auth/logout`
- **Authentication:** Required
- **Returns:** Success message

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Confession Endpoints

### 1. Get All Confessions
- **Method:** GET
- **Path:** `/confessions`
- **Authentication:** Not required
- **Query Parameters:**
  - `sortBy` (optional): `newest` | `trending` (default: `newest`)
  - `category` (optional): `All` | `General` | `Crush` | `Study` | `Funny` | `Rant` (default: `All`)

**Request:**
```bash
GET /confessions?sortBy=trending&category=Crush
```

**Response (200 OK):**
```json
{
  "confessions": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": {
        "_id": "507f1f77bcf86cd799439012",
        "displayName": "Anon#5234",
        "avatar": "https://...",
        "email": "user@gmail.com"
      },
      "text": "I have a crush on someone...",
      "category": "Crush",
      "hashtags": ["love", "crush"],
      "reactions": {
        "like": 5,
        "love": 12,
        "laugh": 0
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Failed to fetch confessions"
}
```

### 2. Get Single Confession
- **Method:** GET
- **Path:** `/confessions/:id`
- **Authentication:** Not required
- **Parameters:**
  - `:id` - Confession ID (MongoDB ObjectId)

**Request:**
```bash
GET /confessions/507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": { /* user object */ },
  "text": "...",
  "category": "Crush",
  "hashtags": ["love"],
  "reactions": { "like": 5, "love": 12, "laugh": 0 },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error (404 Not Found):**
```json
{
  "error": "Confession not found"
}
```

### 3. Create Confession
- **Method:** POST
- **Path:** `/confessions`
- **Authentication:** Required
- **Rate Limit:** 10 per 15 minutes per user

**Request Body:**
```json
{
  "text": "This is my confession... (minimum 10 characters)",
  "secretCode": "mySecret123",
  "category": "Crush",
  "hashtags": ["love", "crush"]
}
```

**Validation Rules:**
- `text`: 10-2000 characters (required)
- `secretCode`: minimum 4 characters (required)
- `category`: valid enum value (optional, default: "General")
- `hashtags`: array of strings (optional)

**Response (201 Created):**
```json
{
  "message": "Confession created successfully",
  "confession": {
    "_id": "507f1f77bcf86cd799439011",
    "text": "This is my confession...",
    "category": "Crush",
    "hashtags": ["love", "crush"],
    "reactions": { "like": 0, "love": 0, "laugh": 0 },
    "userId": { /* user object */ },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
```json
// 400 Bad Request - Validation failed
{
  "error": "\"text\" length must be at least 10 characters long"
}

// 401 Unauthorized - Not authenticated
{
  "error": "Not authenticated"
}

// 429 Too Many Requests - Rate limited
{
  "error": "Too many confessions created, please try again later."
}
```

### 4. Update Confession
- **Method:** PUT
- **Path:** `/confessions/:id`
- **Authentication:** Required
- **Authorization:** Only confession owner can update

**Request Body:**
```json
{
  "text": "Updated confession text...",
  "secretCode": "newSecret456",
  "currentSecretCode": "mySecret123",
  "category": "Rant",
  "hashtags": ["life", "thoughts"]
}
```

**Validation:**
- Current secret code must be correct
- New secret code must be at least 4 characters

**Response (200 OK):**
```json
{
  "message": "Confession updated successfully",
  "confession": {
    "_id": "507f1f77bcf86cd799439011",
    "text": "Updated confession text...",
    "category": "Rant",
    "hashtags": ["life", "thoughts"],
    "reactions": { "like": 5, "love": 12, "laugh": 0 },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Errors:**
```json
// 400 Bad Request - Validation failed
{
  "error": "\"currentSecretCode\" is required"
}

// 401 Unauthorized - Wrong secret code
{
  "error": "Incorrect secret code"
}

// 403 Forbidden - Not owner
{
  "error": "Unauthorized"
}

// 404 Not Found
{
  "error": "Confession not found"
}
```

### 5. Delete Confession
- **Method:** DELETE
- **Path:** `/confessions/:id`
- **Authentication:** Required
- **Authorization:** Only confession owner can delete

**Request Body:**
```json
{
  "secretCode": "mySecret123"
}
```

**Response (200 OK):**
```json
{
  "message": "Confession deleted successfully"
}
```

**Errors:**
```json
// 400 Bad Request - Missing secret code
{
  "error": "Secret code is required and must be at least 4 characters"
}

// 401 Unauthorized - Wrong secret code
{
  "error": "Incorrect secret code"
}

// 403 Forbidden - Not owner
{
  "error": "Unauthorized"
}

// 404 Not Found
{
  "error": "Confession not found"
}
```

### 6. Add Reaction
- **Method:** POST
- **Path:** `/confessions/:id/react`
- **Authentication:** Required

**Request Body:**
```json
{
  "reactionType": "like"
}
```

**Valid Reaction Types:**
- `like`
- `love`
- `laugh`

**Response (200 OK):**
```json
{
  "message": "Reaction added",
  "reactions": {
    "like": 6,
    "love": 12,
    "laugh": 0
  }
}
```

**Notes:**
- If user already reacted, the previous reaction is removed and new one is added
- Only one reaction per user per confession

**Errors:**
```json
// 400 Bad Request - Invalid reaction type
{
  "error": "Invalid reaction type"
}

// 404 Not Found
{
  "error": "Confession not found"
}
```

### 7. Get User Confessions
- **Method:** GET
- **Path:** `/confessions/user/confessions/my`
- **Authentication:** Required

**Response (200 OK):**
```json
{
  "confessions": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "text": "My confession...",
      "category": "Crush",
      "hashtags": ["love"],
      "reactions": { "like": 5, "love": 12, "laugh": 0 },
      "userId": { /* user object */ },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

---

## Error Handling

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Bad request (validation failed) |
| 401 | Unauthorized (not logged in or invalid code) |
| 403 | Forbidden (no permission) |
| 404 | Resource not found |
| 429 | Too many requests (rate limited) |
| 500 | Internal server error |

### Error Response Format
```json
{
  "error": "Description of the error"
}
```

---

## Rate Limiting

### Confession Creation
- **Limit:** 10 confessions per 15 minutes per user
- **Headers Returned:**
  - `RateLimit-Limit`: 10
  - `RateLimit-Remaining`: 9
  - `RateLimit-Reset`: 1705314600

### General Requests
- **Limit:** 100 requests per 15 minutes per IP
- **Error Response:**
```json
{
  "error": "Too many requests, please try again later."
}
```

---

## Security Notes

1. **Secret Codes:** Hashed with bcryptjs before storage
2. **Sessions:** HTTP-only cookies with SameSite=Lax
3. **CORS:** Configured for frontend URL only
4. **Input Validation:** All inputs validated with Joi
5. **Rate Limiting:** Prevents spam and abuse
6. **No Sensitive Data:** Secret codes never returned in responses

---

## Example Requests

### Complete Workflow

```javascript
// 1. Login with Google (automatic redirect)
window.location.href = 'http://localhost:5000/auth/google'

// 2. Get current user
const user = await fetch('http://localhost:5000/auth/me', {
  credentials: 'include'
}).then(r => r.json())

// 3. Create confession
const confession = await fetch('http://localhost:5000/confessions', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'I have a confession to make...',
    secretCode: 'mySecretCode123',
    category: 'Crush',
    hashtags: ['love', 'feelings']
  })
}).then(r => r.json())

// 4. Add reaction
const reaction = await fetch(`http://localhost:5000/confessions/${confession._id}/react`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reactionType: 'love' })
}).then(r => r.json())

// 5. Get all confessions
const confessions = await fetch('http://localhost:5000/confessions?sortBy=trending&category=Crush')
  .then(r => r.json())

// 6. Logout
await fetch('http://localhost:5000/auth/logout', {
  method: 'POST',
  credentials: 'include'
}).then(r => r.json())
```

---

## Version History

- **v1.0.0** - Initial release with core features

---

For more information, see [README.md](./README.md)
