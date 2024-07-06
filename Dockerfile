# Stage 1: Build Angular app
FROM node:16 as build

WORKDIR /app

COPY ./celestradepro/package*.json ./
RUN npm install
COPY ./celestradepro .
RUN npm run build -- --output-path=dist

# Stage 2: Set up the backend and serve both frontend and backend
FROM node:16

WORKDIR /app

# Install http-server
RUN npm install -g http-server

# Copy frontend build
COPY --from=build /app/dist ./dist

# Copy backend files
COPY ./celestradepro/Backend ./Backend

WORKDIR /app/Backend
RUN npm install

EXPOSE 4200
EXPOSE 3000

CMD ["sh", "-c", "http-server -p 4200 ./dist & node server.js"]
