# Dockerfile
FROM oven/bun:alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source code
COPY . .

# Build the application
RUN bun build ./src/index.ts --outdir ./dist --minify --format esm --target bun && \
    bun build ./bin/agas.ts --outfile ./dist/bin/agas.js --minify --format esm --target bun

# Production stage
FROM oven/bun:alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S agas && adduser -S agas -G agas

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Make CLI executable
RUN chmod +x /app/dist/bin/agas.js && \
    ln -s /app/dist/bin/agas.js /usr/local/bin/agas

# Create config directory
RUN mkdir -p /home/agas/.agas && \
    chown -R agas:agas /home/agas

# Switch to non-root user
USER agas

# Set environment
ENV NODE_ENV=production
ENV AGAS_COLOR_OUTPUT=true

ENTRYPOINT ["agas"]
CMD ["--help"]

