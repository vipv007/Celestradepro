# ---------- Stage 1: Build Angular frontend ----------
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --output-path=dist

# ---------- Stage 2: Build backend ----------
FROM node:18 AS backend-build
WORKDIR /app/backend
COPY Backend/package*.json ./
RUN npm install
COPY Backend/ .

# ---------- Final Stage: Serve frontend + backend ----------
FROM node:18
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend ./Backend

# Copy Angular dist to backend/public
COPY --from=frontend-build /app/frontend/dist ./Backend/public

WORKDIR /app/Backend

# ENV variables (PORT/MONGO_URI can be injected via Azure App Settings)
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
