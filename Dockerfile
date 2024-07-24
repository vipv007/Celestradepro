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
RUN npm run build -- --output-path=dist

# Use a smaller base image to serve the Angular app and run the Node.js server
FROM node:16

# Install a simple HTTP server to serve the Angular app
RUN npm install -g http-server

# Set the working directory in the container
WORKDIR /app

# Copy the built Angular app from the build stage to the container
COPY --from=build /app/dist ./dist

# Copy the server.js file to the container
COPY ./celestradepro/Backend/server.js ./Backend/server.js

# Copy the package.json and package-lock.json for the backend server
COPY ./celestradepro/Backend/package*.json ./Backend/

# Install dependencies for the backend server
RUN cd ./Backend && npm install

# Expose the port your Angular app will listen on (e.g., 4200)
EXPOSE 4200

# Start both the HTTP server to serve your Angular app and the Node.js server
CMD ["sh", "-c", "node ./Backend/server.js & http-server -p 4200 dist"]
