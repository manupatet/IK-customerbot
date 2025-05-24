# Dockerfile for Next.js App

# Stage 1: Base Node image with non-root user setup
FROM node:20-alpine AS base
WORKDIR /app
# Create a non-root user and group for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Stage 2: Install all dependencies
# This stage creates a node_modules layer that can be cached.
FROM base AS deps
# Copy package.json and lock file
COPY package.json package-lock.json* ./
# Install all dependencies (including devDependencies for build)
RUN npm ci

# Stage 3: Build the application
# This stage builds the Next.js app using the dependencies from the 'deps' stage.
FROM base AS builder
# Copy application source code
COPY . .
# Copy node_modules from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Build the Next.js application
RUN npm run build

# Stage 4: Production image
# This stage creates the final, lean image with only production artifacts.
FROM base AS runner
ENV NODE_ENV=production
# The PORT environment variable will be respected by `next start` (default 3000)
# ENV PORT=3000

# Copy package.json and lock file to install only production dependencies
COPY --chown=nextjs:nodejs package.json package-lock.json* ./
# Install only production dependencies. node_modules will be owned by root here, which is fine for runtime.
RUN npm ci --omit=dev --ignore-scripts

# Copy built application files from the 'builder' stage, ensuring correct ownership
COPY --chown=nextjs:nodejs --from=builder /app/public ./public
COPY --chown=nextjs:nodejs --from=builder /app/.next ./.next
COPY --chown=nextjs:nodejs --from=builder /app/next.config.ts ./next.config.ts
# package.json is already copied and chowned.
# node_modules was installed above as root, which is common and typically safe for runtime.

# Switch to the non-root user
USER nextjs

EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
