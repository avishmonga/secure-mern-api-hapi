# Use an official Node.js runtime as a parent image
FROM node:20.18

# Set the working directory in the container
WORKDIR /app

# Build arguments for passing environment variables
ARG JWT_SECRET
ARG ENCRYPTION_PASSWORD
ARG HOST

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables inside the container
ENV JWT_SECRET=$JWT_SECRET
ENV ENCRYPTION_PASSWORD=$ENCRYPTION_PASSWORD
ENV HOST=$HOST

# Run tests
RUN npm test

# Expose the application's port
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]