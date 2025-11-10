FROM oven/bun:alpine
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun build ./src/index.ts --outdir ./dist --minify --format esm --target bun
RUN bun build ./bin/agas.ts --outfile ./build/agas.js --minify --format esm --target bun
RUN chmod +x /app/build/agas.js
RUN ln -s /app/build/agas.js /usr/local/bin/agas
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
ENTRYPOINT ["/usr/local/bin/agas"]
CMD ["--help"]
