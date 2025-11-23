# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build   # generates /app/out

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve

# Copy exported static site
COPY --from=builder /app/out ./out

EXPOSE 3000
CMD ["serve", "-s", "out", "-l", "3000"]
