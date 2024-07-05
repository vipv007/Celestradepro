# # Define from what image we want to build from
# FROM node:14

# # Use a Windows base image
# #FROM mcr.microsoft.com/windows/servercore:ltsc2019

# # Create app directory
# WORKDIR /usr/src/app 

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./ 

# # If you are building your code for production
# # RUN npm ci --only=production
# RUN npm install

# # Bundle app source
# COPY . . 

# # Bind to port 8000
# EXPOSE 8000

# # Start the server
# CMD [ "node", "helloworld.js" ]
