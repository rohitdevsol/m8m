FROM oven/bun:alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/producer/package.json ./apps/producer/
COPY packages/database/package.json ./packages/database/
COPY packages/kafka/package.json ./packages/kafka/
# Add other packages as needed
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build --filter=producer

# Runner
FROM base AS runner
WORKDIR /app
COPY --from=builder /app ./
CMD ["bun", "run", "apps/producer/index.ts"]
