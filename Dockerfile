# Build Angular app
FROM node:20 AS build

WORKDIR /app

COPY celestradepro/package*.json ./celestradepro/
WORKDIR /app/celestradepro
RUN npm install -g @angular/cli && npm install --legacy-peer-deps

COPY celestradepro/ ./
RUN ng build --output-path=www --configuration production

# Production image: use Node.js and serve
FROM node:20

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built Angular app from build stage
COPY --from=build /app/celestradepro/www ./www

EXPOSE 80
CMD ["serve", "-s", "www", "-l", "80"]