# Use official Node 20 image
FROM node:20.19-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy all files
COPY . .

# Build the Next.js app
RUN npm run build

# Use a smaller base image for production
FROM node:20.19-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy built app and node_modules from build stage
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
