FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests first (layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy backend source files only
COPY server.js ./
COPY app.js ./

# Cloud Run expects port 8080 by default
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
