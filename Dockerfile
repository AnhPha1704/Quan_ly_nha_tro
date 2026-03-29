# Sử dụng Node.js làm image cơ sở
FROM node:20-alpine AS base

# Cài đặt các dependencies cần thiết
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Sao chép file cấu hình package
COPY package.json package-lock.json* ./
RUN npm ci

# Giai đoạn Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js thu thập dữ liệu đo lường ẩn danh, vô hiệu hóa nó
ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma Client
RUN npx prisma generate

RUN npm run build

# Giai đoạn Chạy (Production)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Tự động tạo thư mục cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Tối ưu hóa dung lượng image bằng cách sử dụng output standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# server.js được tạo ra bởi next build khi standalone là true
CMD ["node", "server.js"]
