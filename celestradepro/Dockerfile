# Stage 1: Build the Angular frontend
FROM node:16 AS build-frontend

WORKDIR /app/frontend

COPY package*.json ./

# Clean npm cache
RUN npm cache clean --force

COPY . .

# Set memory limit for Node.js to prevent heap out of memory errors
ENV NODE_OPTIONS=--max_old_space_size=8192

# Run the Angular build with AOT (Ahead of Time Compilation)
RUN npm run build -- --output-path=www

# Stage 2: Build the backend
FROM node:16 AS build-backend

WORKDIR /app/backend

COPY Backend/package*.json ./

RUN npm install --legacy-peer-deps

COPY Backend .

# Stage 3: Final stage to serve the Angular app and run the backend
FROM node:16

RUN npm install -g http-server

WORKDIR /app

# Copy the built Angular app from the build stage to the container
COPY --from=build-frontend /app/frontend/www ./frontend  

WORKDIR /app/backend

# Copy the backend from the build stage to the container
COPY --from=build-backend /app/backend .

EXPOSE 4200 3000

CMD ["sh", "-c", "http-server -p 4200 /app/frontend & npm start"]
