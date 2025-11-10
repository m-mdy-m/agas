
FROM oven/bun:alpine AS builder
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun build ./src/index.ts --outdir ./dist --minify --format esm --target bun
RUN bun build ./bin/agas.ts --outfile ./build/agas.js --minify --format esm --target bun
RUN chmod +x /app/build/agas.js
FROM alpine:3.19
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/build/agas.js /app/build/agas.js
RUN ln -s /app/build/agas.js /usr/local/bin/agas && chmod +x /app/build/agas.js
USER appuser

ENTRYPOINT ["/usr/local/bin/agas"]
CMD ["--help"]
