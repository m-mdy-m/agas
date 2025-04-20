FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun build ./src/index.ts --outdir ./dist --minify --format esm --target bun

RUN sed -i 's|from "../cli"|from "../../cli"|g' bin/agas.ts

RUN bun build ./bin/agas.ts --outdir ./build --minify --format esm --target bun

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN chmod +x /app/build/agas.js
RUN ln -s /app/build/agas.js /usr/local/bin/agas

USER appuser

ENTRYPOINT ["/usr/local/bin/agas"]
CMD ["--help"]