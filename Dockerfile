# Use an official Node.js image as a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port the app will run on (this should match the port in your server)
EXPOSE 5005

# Start the application
CMD ["node", "server.js"]
