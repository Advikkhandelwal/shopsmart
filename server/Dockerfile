# Base stage
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5001

# Development stage
FROM base AS dev
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS prod
CMD ["npm", "start"]
