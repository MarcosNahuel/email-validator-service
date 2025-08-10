# ---- Base ----
# Usa una imagen base de Node.js 20 sobre Alpine Linux
FROM node:20-alpine AS base
WORKDIR /usr/src/app
# Instala pnpm globalmente para gestionar dependencias de forma eficiente
RUN npm install -g pnpm

# ---- Etapa de Dependencias (Builder) ----
# Esta etapa instala todas las dependencias, incluyendo las de desarrollo
FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# Compila el código TypeScript a JavaScript en el directorio /dist
RUN pnpm run build

# ---- Etapa de Producción Final ----
# Esta es la imagen final que se desplegará, es mucho más pequeña y segura
FROM base AS production
ENV NODE_ENV=production
ENV PORT=3000

# Crea un usuario sin privilegios para correr la aplicación
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copia solo los node_modules de producción desde la etapa 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copia solo el código JavaScript compilado desde la etapa 'builder'
COPY --from=builder /usr/src/app/dist ./dist
# Copia los archivos de configuración necesarios
COPY --from=builder /usr/src/app/openapi.yaml ./openapi.yaml

EXPOSE 3000

# Define un chequeo de salud para que EasyPanel sepa si la app está viva
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/api/v1/healthz || exit 1

# El comando final para iniciar el servidor, usando el JS compilado
CMD [ "node", "dist/server.js" ]
