# Utiliser une image de base avec Node.js
#Use a base image with Node.js
FROM node:18

# Create a work repository
WORKDIR /app

# Copy the project files in the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the port on which the application run
EXPOSE 10010

# Command to start the application
CMD ["node", "server.js"]
