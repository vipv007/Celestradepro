# Base image for building the Angular frontend
FROM node:16 AS build-frontend

# Set the working directory in the container for frontend
WORKDIR /app/frontend

# Copy the package.json and package-lock.json from the Angular app directory to the container
COPY package*.json ./

# Install dependencies for frontend
RUN npm install --force --legacy-peer-deps

# Copy the entire Angular app source code from the Angular app directory to the container
COPY . .

# Set the Node.js memory limit to 8 GB
ENV NODE_OPTIONS=--max_old_space_size=8192

# Build the Angular app
RUN npm run build -- --output-path=www  # Temporary build command without verification

# Base image for building the backend
FROM node:16 AS build-backend

# Set the working directory in the container for backend
WORKDIR /app/backend

# Copy the package.json and package-lock.json from the backend directory to the container
COPY celestradepro/Backend/package*.json ./

# Install backend dependencies
RUN npm install --force

# Copy the entire backend source code to the container
COPY celestradepro/Backend .

# Final stage to serve the Angular app and run the backend
FROM node:16

# Install a simple HTTP server to serve the Angular app
RUN npm install -g http-server

# Set the working directory for the frontend
WORKDIR /app

# Copy the built Angular app from the build stage to the container
COPY --from=build-frontend /app/frontend/www ./frontend  

# Set the working directory for the backend
WORKDIR /app/backend

# Copy the backend from the build stage to the container
COPY --from=build-backend /app/backend .

# Expose the ports your app and backend will listen on (e.g., 4200 for Angular, 3000 for backend)
EXPOSE 4200 3000

# Start both the HTTP server to serve your Angular app and the backend server
CMD ["sh", "-c", "http-server -p 4200 /app/frontend & npm start"]
