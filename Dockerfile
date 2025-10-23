# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY smart-budget/package*.json ./smart-budget/
WORKDIR /app/smart-budget
RUN npm ci
COPY smart-budget/ .
RUN npm run build

# Runtime stage (static serve with nginx)
FROM nginx:1.27-alpine
COPY --from=build /app/smart-budget/dist /usr/share/nginx/html
# SPA fallback for client-side routing
RUN printf "server {\n  listen 8080;\n  root /usr/share/nginx/html;\n  location / {\n    try_files \$uri /index.html;\n  }\n}\n" > /etc/nginx/conf.d/default.conf
EXPOSE 8080
