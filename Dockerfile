# Stage 1: Build the Angular application
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

# Stage 2: Set up the server and serve the Angular app
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the server files
COPY ./celestradepro/server .  
# Adjust this path to your server files location

# Copy the built Angular app from the build stage to the container
COPY --from=build /app/dist ./dist

# Install server dependencies
RUN npm install

# Expose the port your app will listen on
EXPOSE 3000 
 # Change this to the port your server listens on

# Start the server
CMD ["node", "server.js"]
