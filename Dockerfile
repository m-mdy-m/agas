FROM oven/bun:alpine AS builder
LABEL stage=builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN bun build ./src/index.ts --outdir ./dist --minify --format esm --target bun
RUN bun build ./bin/agas.ts --outdir ./build --minify --format esm --target bun

FROM alpine:latest
LABEL stage=runtime

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/build/agas.js /usr/local/bin/agas

RUN chmod +x /usr/local/bin/agas

ENTRYPOINT ["/usr/local/bin/agas"]
CMD ["--help"]
