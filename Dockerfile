# ==========================================
# Stage 1: Build & Bundling
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all packages (development + production)
RUN npm install

# Copy codebase
COPY . .

# Compile static Vite assets and bundle the Express server
RUN npm run build

# ==========================================
# Stage 2: Runtime Environment
# ==========================================
FROM node:20-alpine

WORKDIR /app

# Set production context
ENV NODE_ENV=production

# Copy dependency frames
COPY package*.json ./

# Install only production-grade node modules
RUN npm install --only=production

# Copy compiled bundles from builder stage
COPY --from=builder /app/dist ./dist

# Expose server listener port
EXPOSE 3000

# Execute server bundle
CMD ["npm", "run", "start"]
