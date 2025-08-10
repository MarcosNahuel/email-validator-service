FROM node:20-alpine
WORKDIR /app

# Instalar deps
COPY package.json ./
RUN npm i --omit=dev

# Copiar código
COPY . .

# Variables/puerto
ENV NODE_ENV=production
EXPOSE 3000

# Comando de arranque
CMD ["node","index.js"]
