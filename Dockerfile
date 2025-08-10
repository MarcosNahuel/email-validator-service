# ---- Etapa de Builder ----
# Esta etapa instala todas las dependencias (incluyendo dev) y compila el código TS a JS.
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copia los archivos de definición de paquetes e instala todo
COPY package.json package-lock.json* ./
RUN npm install

# Copia el resto del código fuente y compila
COPY . .
RUN npm run build

# ---- Etapa de Producción Final ----
# Esta es la imagen final, mucho más pequeña y segura.
FROM node:20-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Crea un usuario sin privilegios para mayor seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia solo las dependencias de producción desde la etapa 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copia el código JavaScript ya compilado desde la etapa 'builder'
COPY --from=builder /usr/src/app/dist ./dist
# Copia otros archivos necesarios en tiempo de ejecución
COPY openapi.yaml ./openapi.yaml

USER appuser
EXPOSE 3000

# Define un chequeo de salud para que EasyPanel sepa si la app está funcionando.
# Asegúrate de que la ruta /healthz existe.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/healthz || exit 1

# Comando para iniciar el servidor
CMD [ "node", "dist/server.js" ]
