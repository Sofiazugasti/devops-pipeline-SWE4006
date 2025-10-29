#Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Only copy manifests first for better layer caching
COPY smart-budget/package*.json ./
RUN npm ci

# Copy the rest of the app and build
COPY smart-budget/ .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
# Serve static files from /dist using "serve"
RUN npm i -g serve

# Copy the build output from the previous stage
COPY --from=build /app/dist ./dist

# Azure App Service for Linux expects the container to listen on 8080
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
