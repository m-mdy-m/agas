FROM oven/bun:alpine AS builder
LABEL stage=builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN sed -i 's|from '\''../cli'\''|from '\''./cli'\''|g' bin/agas.ts

RUN bun build ./src/index.ts --outdir ./dist --minify --format esm --target bun && \
    bun build ./bin/agas.ts --outdir ./build --minify --format esm --target bun

FROM alpine:latest
LABEL stage=runtime

RUN apk add --no-cache ca-certificates bun

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/build/agas.js /usr/local/bin/agas

RUN chmod +x /usr/local/bin/agas

USER appuser

ENTRYPOINT ["/usr/local/bin/agas"]
CMD ["--help"]