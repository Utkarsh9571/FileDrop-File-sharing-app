# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env.production .env.production
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
EXPOSE 80
