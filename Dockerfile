# Use an official Node.js runtime as a parent image
FROM node:20.18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run tests
RUN npm test

# Expose the application's port
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]