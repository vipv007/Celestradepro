# Stage 1: Build Angular frontend
FROM node:16 as build-frontend

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy the Angular app package files and install dependencies
COPY ./celestradepro/package*.json ./
RUN npm install

# Copy the Angular app source code and build it
COPY ./celestradepro ./
RUN npm run build -- --output-path=dist

# Stage 2: Set up the backend server
FROM node:16 as build-backend

# Set the working directory for the backend
WORKDIR /app/backend

# Copy the backend package files and install dependencies
COPY ./celestradepro/Backend/package*.json ./
RUN npm install

# Copy the backend source code
COPY ./celestradepro/Backend ./

# Stage 3: Final image to run both frontend and backend
FROM node:16

# Install a simple HTTP server to serve the Angular app
RUN npm install -g http-server

# Set the working directory
WORKDIR /app

# Copy the built Angular app from the build stage
COPY --from=build-frontend /app/frontend/dist /app/frontend/dist

# Copy the backend code from the build stage
COPY --from=build-backend /app/backend /app/backend

# Expose ports for the frontend and backend
EXPOSE 4200
EXPOSE 3000

# Start the HTTP server to serve the Angular app and run the backend server
CMD ["sh", "-c", "http-server /app/frontend/dist -p 4200 & node /app/backend/server.js"]
