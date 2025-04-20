FROM oven/bun:alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy all source files
COPY . .

# Build the main library first
RUN bun build ./src/index.ts --outdir ./dist --minify --format esm --target bun

# Fix the import path in the CLI file before building
# The issue is that after building the main library, the CLI needs to import from the correct path
RUN sed -i 's|from "../cli"|from "../../cli"|g' bin/agas.ts

# Create the cli directory structure in dist to ensure imports work
RUN mkdir -p dist/cli/utils
COPY cli/utils/color.util.ts dist/cli/utils/
COPY cli/utils/index.ts dist/cli/utils/
COPY cli/index.ts dist/cli/

# Now build the CLI tool with the correct paths
RUN bun build ./bin/agas.ts --outdir ./build --minify --format esm --target bun

# Set up a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Make the CLI executable and create a symlink to make it available globally
RUN chmod +x /app/build/agas.js
RUN ln -s /app/build/agas.js /usr/local/bin/agas

# Switch to non-root user
USER appuser

# Set the entrypoint and default command
ENTRYPOINT ["/usr/local/bin/agas"]
CMD ["--help"]