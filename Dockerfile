# Use the official Node.js image
FROM node:16-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libxrandr2 \
    xdg-utils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create and set the application directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variable for Playwright to skip installing Chromium (it will be installed in Docker)
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Expose the port
EXPOSE 8080

# Start the application
CMD ["node", "index.js"]
