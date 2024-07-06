# Stage 1: Build Angular app
FROM node:16 as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json from the Angular app directory to the container
COPY ./celestradepro/package*.json ./

# Add debugging steps
# RUN ls -la
# RUN cat package.json

# Install dependencies
RUN npm install

# Copy the entire Angular app source code from the Angular app directory to the container
COPY ./celestradepro .

# Set the Node.js memory limit
ENV NODE_OPTIONS=--max_old_space_size=4096

# Build the Angular app
RUN npm run build -- --output-path=dist

# Stage 2: Set up the Node.js server
FROM node:16

# Install a simple HTTP server to serve the Angular app
RUN npm install -g http-server

# Set the working directory in the container
WORKDIR /app

# Copy the built Angular app from the build stage to the container
COPY --from=build /app/dist ./dist

# Copy the Node.js server files to the container
COPY ./celestradepro/Backend .

# Add debugging steps
# RUN ls -la
# RUN cat package.json

# Install server dependencies
# RUN npm install 

# Expose the ports your apps will listen on
EXPOSE 4200
EXPOSE 3000

# Start the Node.js server
CMD ["node", "server.js"]
