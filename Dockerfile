# Production container for FireStar Gaming Blog API
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY server ./server
ENV NODE_ENV=production
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:5000/healthz || exit 1
CMD ["node", "server/index.js"]
