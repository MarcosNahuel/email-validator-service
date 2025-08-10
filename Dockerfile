FROM node:20-alpine
WORKDIR /app

# Solo package.json para instalar deps
COPY package.json ./

# ---> Guard: falla el build si nodemailer aún está en package.json
RUN echo "=== package.json que llegó ===" \
 && cat /app/package.json \
 && node -e "const p=require('./package.json'); if (p.dependencies&&p.dependencies.nodemailer) { throw new Error('❌ package.json contiene nodemailer; quítalo antes de build.'); }" \
 && npm i --omit=dev \
 && echo '=== deps instaladas ===' \
 && (npm ls --depth=0 || true)

# Copiar el resto del código
COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","index.js"]
