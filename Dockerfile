# Use the official Node.js 14 image as the base
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install project dependencies
RUN npm install --production

# Expose port 80
EXPOSE 80

# Start the application
CMD ["npm", "start"]