# Use an official Node.js runtime as the base image for the build stage
FROM node:16 as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json from the Angular app directory to the container
COPY ./celestradepro/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire Angular app source code from the Angular app directory to the container
COPY ./celestradepro .

# Build the Angular app
RUN npm run build

# Use a smaller base image to serve the Angular app (e.g., "http-server")
FROM node:16

# Install a simple HTTP server to serve the Angular app
RUN npm install -g http-server

# Set the working directory in the container
WORKDIR /app

# Copy the built Angular app from the build stage to the container
COPY --from=build /app/dist/celestradepro .

# Expose the port your app will listen on (e.g., 8080)
EXPOSE 8080

# Start the HTTP server to serve your Angular app
CMD ["http-server", "-p", "8080"]
