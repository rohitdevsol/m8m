# Node 22 slim for full glibc compatibility, Prisma, and Next.js support.
FROM node:22-slim AS base
# Install Bun, Turbo, and Dotenv-CLI globally
RUN npm install -g bun turbo dotenv-cli
# Install OpenSSL and Git which Prisma/Turbo sometimes need 
RUN apt-get update -y && apt-get install -y openssl git

WORKDIR /app

# Copy all files at once (no cache optimization, just guaranteed to work)
COPY . .

# Install dependencies using bun
RUN bun install

# Provide a dummy database URL so Prisma can parse the schema during build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Build the app 
ENV NODE_ENV=production
RUN bun run build --filter=web

# Runner stage
FROM node:22-slim AS runner
RUN npm install -g bun
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# We need a system user for Next.js security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy over the built public and standalone folders
COPY --from=base /app/apps/web/public ./apps/web/public
COPY --from=base --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
