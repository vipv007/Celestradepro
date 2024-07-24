# Stage 1: Build the Angular app
FROM node:18 as build

WORKDIR /app

COPY ./celestradepro/package*.json ./
RUN npm install --legacy-peer-deps

COPY ./celestradepro .
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run build -- --output-path=dist

# Stage 2: Serve the Angular app and run backend
FROM node:18

RUN npm install -g http-server

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY ./celestradepro/Backend ./Backend

RUN npm install --legacy-peer-deps --prefix ./Backend

EXPOSE 3000
EXPOSE 4200

ARG MONGO_URI
ENV MONGO_URI=${MONGO_URI}

CMD ["sh", "-c", "http-server -p 4200 dist & cd Backend && node server.js"]
