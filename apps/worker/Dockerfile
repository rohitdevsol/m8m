FROM oven/bun:alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/database/package.json ./packages/database/
COPY packages/kafka/package.json ./packages/kafka/
COPY packages/types/package.json ./packages/types/
COPY packages/common/package.json ./packages/common/
# Add other packages as needed
RUN bun install

# Build
FROM base AS builder
RUN apk add --no-cache nodejs
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# We don't need to rebuild for simple Bun apps that run from index.ts, but standard practice in Turbo is to build
RUN bun x turbo build --filter=worker
# For now, let's keep it simple

# Runner
FROM base AS runner
WORKDIR /app
COPY --from=builder /app ./
CMD ["bun", "run", "apps/worker/index.ts"]
