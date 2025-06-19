# Stage 1: Build Angular
FROM node:18 AS build-frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production --output-path=Backend/public

# Stage 2: Run backend
FROM node:18
WORKDIR /app
COPY --from=build-frontend /app/Backend /app/Backend
WORKDIR /app/Backend
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
