FROM node:20-alpine
WORKDIR /app

# Instala solo prod deps
COPY package.json ./
RUN npm i --omit=dev

# Copia el código
COPY . .

ENV NODE_ENV=production

# El puerto donde escucha tu app
EXPOSE 3000

# Arranca la app
CMD ["node","index.js"]
