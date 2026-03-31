# Node 22 slim for full glibc compatibility, Prisma, and Next.js support.
FROM node:22-slim AS base
# Install Bun, Turbo, and Dotenv-CLI globally
RUN npm install -g bun turbo dotenv-cli
# Install OpenSSL and Git which Prisma/Turbo sometimes need 
RUN apt-get update -y && apt-get install -y openssl git

WORKDIR /app

# Copy all files at once
COPY . .

# Install dependencies using bun
RUN bun install

# Provide a dummy database URL so Prisma can parse the schema during build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Build the specific app 
ENV NODE_ENV=production
RUN bun run build --filter=worker

# Runner stage
FROM node:22-slim AS runner
RUN npm install -g bun
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy the entire built structure from base
COPY --from=base /app ./

CMD ["bun", "run", "apps/worker/index.ts"]
