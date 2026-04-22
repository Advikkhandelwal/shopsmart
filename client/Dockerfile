# Base stage
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Development stage
FROM base AS dev
EXPOSE 5173
# Expose host to be accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]

# Build stage
FROM base AS build
RUN npm run build

# Production stage
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
