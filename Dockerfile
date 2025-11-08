# Sử dụng Node.js 18 Alpine image
FROM node:18-alpine AS base

# Cài đặt dependencies cần thiết cho Alpine
RUN apk add --no-cache libc6-compat

# Thiết lập working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm devDependencies để build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build ứng dụng
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Cài đặt dependencies cần thiết
RUN apk add --no-cache \
    iputils \
    bind-tools \
    whois \
    curl

# Tạo user non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Thiết lập working directory
WORKDIR /app

# Copy built application
COPY --from=base --chown=nextjs:nodejs /app/.next ./.next
COPY --from=base --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=base --chown=nextjs:nodejs /app/public ./public

# Chuyển sang user non-root
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/ping || exit 1

# Start command
CMD ["npm", "start"]
