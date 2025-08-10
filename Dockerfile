## Multi-stage build para producir una imagen mínima y sin conflictos de CMD

# 1) Dependencias de producción
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 2) Builder (instala dev deps y compila TypeScript -> dist)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# 3) Runtime final
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Solo las deps de producción y los artefactos compilados
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY --from=builder /app/dist ./dist

# Archivos necesarios en runtime fuera de dist
COPY openapi.yaml ./openapi.yaml

EXPOSE 3000
CMD ["node", "dist/server.js"]
