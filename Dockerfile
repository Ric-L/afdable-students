# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install serve to run the app
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]

# # Install dependencies
# FROM node:22-alpine AS deps
# WORKDIR /app

# COPY package.json package-lock.json* ./
# RUN npm ci

# # Build the app
# FROM node:22-alpine AS builder
# WORKDIR /src
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN npm run build

# # Run the app
# FROM node:22-alpine AS runner
# WORKDIR /src

# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED 1

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# EXPOSE 3000

# CMD ["npm", "start"]