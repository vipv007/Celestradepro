# Stage 1: Build the Angular app
FROM node:18 as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json from the Angular app directory to the container
COPY ./celestradepro/package*.json ./

# Install frontend dependencies with --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copy the entire Angular app source code from the Angular app directory to the container
COPY ./celestradepro .

# Set the Node.js memory limit
ENV NODE_OPTIONS=--max_old_space_size=4096

# Build the Angular app
RUN npm run build -- --output-path=dist

# Stage 2: Setup the backend and serve the Angular app
FROM node:18

# Set the working directory for the backend
WORKDIR /app

# Copy backend package.json and install backend dependencies
COPY ./celestradepro/Backend/package*.json ./Backend/
RUN cd Backend && npm install

# Copy the backend source code to the container
COPY ./celestradepro/Backend ./Backend

# Copy the built Angular app from the build stage to the container
COPY --from=build /app/dist /app/dist

# Install a simple HTTP server to serve the Angular app
RUN npm install -g http-server

# Expose the ports for both backend and frontend
EXPOSE 3000 4200

# Start the backend and frontend services
CMD ["sh", "-c", "cd Backend && node server.js & http-server -p 4200 /app/dist"]
