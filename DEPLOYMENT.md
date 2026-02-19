# Docker & Deployment Guide

## Local Development with Docker

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Docker Compose Setup

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: whisperwall
    volumes:
      - mongo_data:/data/db
    networks:
      - whisperwall-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/whisperwall
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      GOOGLE_CALLBACK_URL: http://localhost:5000/auth/google/callback
      PORT: 5000
      NODE_ENV: development
      SESSION_SECRET: ${SESSION_SECRET}
      FRONTEND_URL: http://localhost:3000
    depends_on:
      - mongodb
    networks:
      - whisperwall-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:5000
      VITE_GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
    depends_on:
      - backend
    networks:
      - whisperwall-network

volumes:
  mongo_data:

networks:
  whisperwall-network:
    driver: bridge
```

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
```

### .dockerignore

Create `.dockerignore` in both backend and frontend:

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
dist
build
```

## Running with Docker

1. **Create .env file in project root:**
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

2. **Start services:**
```bash
docker-compose up -d
```

3. **View logs:**
```bash
docker-compose logs -f
```

4. **Stop services:**
```bash
docker-compose down
```

## Production Deployment

### Deploy to AWS (EC2 + RDS)

1. **Launch EC2 instance**
   - Ubuntu 22.04 LTS
   - t3.micro or larger
   - Security group: Allow ports 80, 443, 22

2. **Connect and setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

3. **Clone and deploy:**
```bash
git clone https://github.com/yourusername/whisperwall.git
cd whisperwall

# Create production .env
nano .env.prod

# Copy docker-compose file for production
cp docker-compose.yml docker-compose.prod.yml

# Edit docker-compose.prod.yml for production
nano docker-compose.prod.yml
```

4. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --standalone -d yourdomain.com
```

5. **Configure Nginx reverse proxy:**
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location /api/ {
        proxy_pass http://backend/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://frontend/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

6. **Start services:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Deploy to Heroku

**Backend only (since Heroku has limitations):**

1. **Create Procfile in backend:**
```
web: npm start
```

2. **Create heroku.yml in backend:**
```yaml
build:
  docker:
    web: Dockerfile
run:
  web: npm start
```

3. **Deploy:**
```bash
cd backend
heroku login
heroku create whisperwall-backend
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set GOOGLE_CLIENT_ID=your_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret
heroku config:set SESSION_SECRET=random_string
git push heroku main
```

### Deploy to DigitalOcean App Platform

1. Connect your GitHub repo to DigitalOcean
2. Create app from git
3. Add both backend and frontend as services
4. Set environment variables in dashboard
5. Deploy

## Monitoring & Maintenance

### Logs
```bash
# View Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Download logs
docker-compose logs > logs.txt
```

### Backups
```bash
# Backup MongoDB
docker exec whisperwall-mongodb mongodump --out /data/db/backup

# Restore MongoDB
docker exec whisperwall-mongodb mongorestore /data/db/backup
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild images
docker-compose build

# Restart services
docker-compose restart
```

## Performance Optimization

1. **Use CDN for static files**
2. **Enable gzip compression**
3. **Implement caching strategies**
4. **Use load balancer for scaling**
5. **Monitor metrics with Prometheus/Grafana**

## Security in Production

1. ✅ Use HTTPS with SSL certificates
2. ✅ Set NODE_ENV=production
3. ✅ Use strong SESSION_SECRET
4. ✅ Implement rate limiting
5. ✅ Regular security updates
6. ✅ Monitor for vulnerabilities
7. ✅ Use environment variables for secrets
8. ✅ Configure CORS properly

---

For more information, see [README.md](./README.md)
