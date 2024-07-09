# Stage 1: Build the Angular application
FROM node:14 as frontend-builder

WORKDIR /app/frontend

# Install dependencies
COPY ./celestradepro/package*.json ./
RUN npm install
RUN npm install highcharts
RUN npm uninstall igniteui-angular-charts igniteui-angular-core
RUN npm install igniteui-angular-charts igniteui-angular-core

# Copy the Angular source code and build it
COPY ./celestradepro .
RUN export NODE_OPTIONS=--max_old_space_size=4096 && npm run build -- --output-path=dist

# Stage 2: Build the backend
FROM node:14 as backend-builder

WORKDIR /app/backend

# Copy the package.json and package-lock.json files
COPY ./Backend/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY ./Backend .

# Stage 3: Combine and Serve the Applications
FROM nginx:alpine

# Copy the built frontend application
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy the backend application code
COPY --from=backend-builder /app/backend /app/backend

# Copy Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Install necessary backend dependencies
WORKDIR /app/backend
RUN npm install --only=production

EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
