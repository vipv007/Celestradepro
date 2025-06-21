FROM node:16 as build
 
# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json from the Angular app directory to the container
COPY ./celestradepro/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire Angular app source code from the Angular app directory to the container
COPY ./celestradepro .

# Set the Node.js memory limit
ENV NODE_OPTIONS=--max_old_space_size=4096

# Build the Angular app
RUN npm install -g @angular/cli && npm install

# Use a smaller base image to serve the Angular app
FROM node:16

# Install a simple HTTP server to serve the Angular app
RUN npm install -g http-server

# Set the working directory in the container
WORKDIR /app

# Copy the built Angular app from the build stage to the container
COPY --from=build /app/dist .

# Expose the port your app will listen on (e.g., 8080)
EXPOSE 4200:4200

# Start the HTTP server to serve your Angular app
CMD ["http-server", "-p", "4200"]


# # Stage 1: Build Angular frontend
# FROM node:16 AS build-frontend
# WORKDIR /app/frontend
# COPY package*.json ./
# RUN npm install -g @angular/cli && npm install
# COPY . .
# # RUN npm run build -- --output-path=www
# RUN node --max-old-space-size=4096 ./node_modules/@angular/cli/bin/ng build --output-path=www


# # Stage 2: Build backend
# FROM node:16 AS build-backend
# WORKDIR /app/backend
# COPY Backend/package*.json ./
# RUN npm install --legacy-peer-deps
# COPY Backend .

# # Stage 3: Serve frontend + run backend
# FROM node:16
# WORKDIR /app

# RUN npm install -g http-server

# # Copy frontend
# COPY --from=build-frontend /app/frontend/www ./frontend

# # Copy backend
# COPY --from=build-backend /app/backend ./backend

# WORKDIR /app/backend

# EXPOSE 4200 3000
# CMD ["sh", "-c", "http-server -p 4200 /app/frontend & node server.js"]