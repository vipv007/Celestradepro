# ───────────────────────────────────────────────
# Stage 1: Build Angular Frontend
FROM node:18 AS build-frontend
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli && npm install
COPY . .
RUN npm run build -- --output-path=Backend/public

# ───────────────────────────────────────────────
# Stage 2: Run Node.js Backend
FROM node:18
WORKDIR /app

# Copy backend code
COPY Backend ./Backend

# Install backend dependencies
WORKDIR /app/Backend
RUN npm install

# Expose backend port
EXPOSE 3000

# Start backend (serves frontend from /public)
CMD ["node", "server.js"]
