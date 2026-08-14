# syntax=docker/dockerfile:1

# ---------- dependencias ----------
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# ---------- compilación ----------
FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# DATABASE_URL solo se necesita en tiempo de ejecución; se pasa una ficticia
# para que `prisma generate` no falle durante la compilación.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npm run build

# ---------- imagen final ----------
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV STORAGE_DIR=/data/archivos

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S next -G nodejs

COPY --from=build /app/public ./public
COPY --from=build --chown=next:nodejs /app/.next/standalone ./
COPY --from=build --chown=next:nodejs /app/.next/static ./.next/static

# Migraciones y cliente de Prisma para poder ejecutar `prisma migrate deploy`
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/prisma ./node_modules/prisma

RUN mkdir -p /data/archivos && chown -R next:nodejs /data
VOLUME ["/data/archivos"]

USER next
EXPOSE 3000

CMD ["node", "server.js"]
