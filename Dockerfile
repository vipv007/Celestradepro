# Stage 1: Build Angular app
FROM node:16 AS build

WORKDIR /app

COPY ./celestradepro/package*.json ./
RUN npm install

COPY ./celestradepro .
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run build -- --output-path=dist

# Stage 2: Serve Angular app
FROM node:16

RUN npm install -g http-server

WORKDIR /app
COPY --from=build /app/dist .

EXPOSE 4200
CMD ["http-server", "-p", "4200"]
