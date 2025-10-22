FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy only the production env file first
COPY backend/.env.production.local .env.production.local

# Copy everything else except .env
COPY . .

# Remove .env if it exists
RUN rm -f .env

EXPOSE 5500

CMD ["sh", "-c", "node server.js || tail -f /dev/null"]
