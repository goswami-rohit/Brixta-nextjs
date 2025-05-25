# --- Stage 1: Build the Next.js application ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and lock file for dependency caching
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

# Install dependencies
#RUN ci

# --- Stage 2: Create the minimal runtime image ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


# Automatically leverage output traces to reduce image size 
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs


EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]