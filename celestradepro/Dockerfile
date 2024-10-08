# Stage 1: Build Angular app
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json from the Angular app directory to the container
COPY ./package*.json ./

# Install dependencies and handle the specific packages with legacy peer deps
RUN npm install --legacy-peer-deps
RUN npm install highcharts --legacy-peer-deps
RUN npm uninstall igniteui-angular-charts igniteui-angular-core --legacy-peer-deps
RUN npm install igniteui-angular-charts igniteui-angular-core --legacy-peer-deps

# Modify TypeScript files to add @ts-ignore to specific lines
RUN find . -type f -name '*.ts' -exec sed -i '/server?: HTTPServer<V> | HTTPSServer<V> | undefined;/s/^/\/\/ @ts-ignore\n/' {} \;

# Copy the entire Angular app source code from the Angular app directory to the container
COPY . .

# Set the Node.js memory limit
ENV NODE_OPTIONS=--max_old_space_size=4096

# Build the Angular app
RUN npm run build -- --output-path=dist

# Stage 2: Serve Angular app and run Node.js server
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Install a simple HTTP server to serve the Angular app
RUN npm install -g http-server

# Copy the built Angular app from the build stage to the container
COPY --from=build /app/dist ./dist

# Copy the server.js file to the container
COPY ./Backend/server.js ./Backend/server.js

# Copy the package.json and package-lock.json for the backend server
COPY ./Backend/package*.json ./Backend/

# Install dependencies for the backend server with legacy-peer-deps
RUN cd ./Backend && npm install --legacy-peer-deps

# Expose the port your Angular app will listen on (e.g., 4200)
EXPOSE 4200

# Start both the HTTP server to serve your Angular app and the Node.js server
CMD ["sh", "-c", "node ./Backend/server.js & http-server -p 4200 dist"]
