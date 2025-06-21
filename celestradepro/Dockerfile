# Stage 1: Build Angular frontend
FROM node:16 AS build-frontend
WORKDIR /app/frontend
COPY package*.json ./
RUN npm install -g @angular/cli && npm install
COPY . .
# RUN npm run build -- --output-path=www
RUN node --max-old-space-size=4096 ./node_modules/@angular/cli/bin/ng build --output-path=www


# Stage 2: Build backend
FROM node:16 AS build-backend
WORKDIR /app/backend
COPY Backend/package*.json ./
RUN npm install --legacy-peer-deps
COPY Backend .

# Stage 3: Serve frontend + run backend
FROM node:16
WORKDIR /app

RUN npm install -g http-server

# Copy frontend
COPY --from=build-frontend /app/frontend/www ./frontend

# Copy backend
COPY --from=build-backend /app/backend ./backend

WORKDIR /app/backend

EXPOSE 4200 3000
CMD ["sh", "-c", "http-server -p 4200 /app/frontend & node server.js"]