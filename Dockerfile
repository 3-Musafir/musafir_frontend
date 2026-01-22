# Use the official Node.js image as a base image
FROM node:22-alpine

# Set the working directory in the container
RUN mkdir -p /var/www/frontend
WORKDIR /var/www/frontend

# Copy package.json and package-lock.json
ADD . /var/www/frontend

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "dev"]
