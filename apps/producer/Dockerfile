# ── Stage 1: Prune the monorepo to only producer + its deps ──
FROM node:22-slim AS pruner
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune producer --docker

# ── Stage 2: Install deps & generate Prisma client ──
FROM node:22-slim AS installer
RUN npm install -g bun
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copy pruned lockfile + package.jsons first (cache-friendly)
COPY --from=pruner /app/out/json/ .
RUN bun install

# Copy pruned source code
COPY --from=pruner /app/out/full/ .

# Generate Prisma client
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN cd packages/database && bunx prisma generate

# ── Stage 3: Slim runtime ──
FROM node:22-slim AS runner
RUN npm install -g bun
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=installer /app .

CMD ["bun", "run", "apps/producer/index.ts"]
