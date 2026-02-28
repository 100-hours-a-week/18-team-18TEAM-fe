# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@9 --activate

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch --frozen-lockfile

FROM base AS builder

COPY --from=deps /root/.local/share/pnpm/store /root/.local/share/pnpm/store
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --offline

COPY next.config.ts tsconfig.json postcss.config.mjs ./
COPY public ./public
COPY src ./src

# CI/CD에서 secrets로 생성한 .env를 빌드 시점에만 사용
COPY .env ./.env

RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p /app/.next/cache && chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
