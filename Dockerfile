# Backend Stage
FROM node:14 as backend-build

# Set the working directory in the container
WORKDIR /app

# Copy the backend package.json and package-lock.json to the container
COPY ./celestradepro/Backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the entire backend source code to the container
COPY ./celestradepro/Backend .

# Build the backend (optional, if you have a build step)
# RUN npm run build

# Frontend Stage
FROM node:14 as frontend-build

# Set the working directory in the container
WORKDIR /app

# Copy the frontend package.json and package-lock.json to the container
COPY ./celestradepro/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the entire frontend source code to the container
COPY ./celestradepro .

# Set the Node.js memory limit
ENV NODE_OPTIONS=--max_old_space_size=4096

# Build the Angular app
RUN npm run build -- --output-path=dist

# Production Stage
FROM node:14

# Install a simple HTTP server to serve the Angular app
RUN npm install -g http-server

# Set the working directory in the container
WORKDIR /app

# Copy the backend from the build stage to the container
COPY --from=backend-build /app /backend

# Copy the built Angular app from the build stage to the container
COPY --from=frontend-build /app/dist /frontend

# Expose the ports your app will listen on
EXPOSE 3000 4200

# Start the backend and frontend
CMD ["sh", "-c", "node /backend/server.js & http-server /frontend -p 4200"]
