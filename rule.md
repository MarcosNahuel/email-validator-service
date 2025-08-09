# Guía para subir el microservicio de validación de correos a EasyPanel

## 1. Preparar el repositorio (mínimo viable)

**package.json**

```json
{
  "name": "email-validator-service",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": { "start": "node index.js" },
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

**index.js**

```js
const express = require("express");
const dns = require("dns").promises;
const net = require("net");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "";

function bad(res, msg, code=400){ return res.status(code).json({ok:false, reason:msg}); }

app.get("/health", (_,res)=>res.json({ok:true}));

app.get("/validate", async (req, res) => {
  if (!API_KEY || req.header("x-api-key") !== API_KEY) return bad(res,"unauthorized",401);
  const email = (req.query.email||"").trim().toLowerCase();
  if (!email) return bad(res,"missing email");
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(email)) return res.json({ok:true, email, deliverability:"UNDELIVERABLE", reason:"syntax"});

  const [local, domain] = email.split("@");
  try {
    const mx = await dns.resolveMx(domain);
    if (!mx || mx.length===0) {
      return res.json({ok:true, email, deliverability:"UNDELIVERABLE", reason:"no_mx"});
    }
    mx.sort((a,b)=>a.priority-b.priority);
    const host = mx[0].exchange;
    await new Promise((resolve, reject) => {
      const sock = net.createConnection(25, host);
      let stage = 0, accepted = false, buf = "";
      const kill = (ok)=>{ try{sock.end();}catch{} ok?resolve():reject(new Error("smtp_fail")); };
      sock.setTimeout(12000, ()=>kill(false));
      sock.on("data", d => {
        buf += d.toString();
        if (buf.endsWith("\r\n")) {
          const line = buf.trim(); buf="";
          if (stage===0 && /^220/.test(line)) { sock.write("HELO italicia.com\r\n"); stage=1; }
          else if (stage===1 && /^250/.test(line)) { sock.write("MAIL FROM: <>\r\n"); stage=2; }
          else if (stage===2 && /^250/.test(line)) { sock.write(`RCPT TO: <${email}>\r\n`); stage=3; }
          else if (stage===3) {
            if (/^250/.test(line) || /^251/.test(line)) accepted=true;
            sock.write("QUIT\r\n"); kill(true);
          }
        }
      });
      sock.on("error", ()=>kill(false));
    });

    return res.json({
      ok:true, email,
      deliverability: "DELIVERABLE",
      reason: "mx_ok_rcpt_attempted"
    });
  } catch (e) {
    return res.json({ok:true, email, deliverability:"RISKY", reason:"mx_lookup_or_smtp_error"});
  }
});

app.listen(PORT, ()=>console.log(`validator up on ${PORT}`));
```

**(Opcional) Dockerfile**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","start"]
```

---

## 2. Subir a EasyPanel

1. En EasyPanel: **New Project → New App**
2. **Source**: conecta tu repo o pega la URL del git
3. **Build method**:

   * Nixpacks (detecta Node y corre `npm start`)
   * Dockerfile (si quieres más control)
4. **Service port**: `3000`
5. **Environment variables**: `API_KEY` con un valor secreto
6. **Deploy** y verifica logs (`validator up on 3000`)

---

## 3. Dominio + SSL

1. En EasyPanel, agrega un **Domain** (ej: `validator.italicia.com`)
2. Crea un **A record** en tu DNS al IP del VPS
3. Activa **HTTPS/SSL** desde EasyPanel

---

## 4. Probar

**Salud:**

```bash
curl https://validator.italicia.com/health
```

**Validación:**

```bash
curl -H "x-api-key: supersecreto123" "https://validator.italicia.com/validate?email=usuario@dominio.com"
```

---

## 5. Conectar con n8n

En un nodo **HTTP Request**:

* **URL**: `https://validator.italicia.com/validate?email={{$json.email}}`
* **Headers**: `x-api-key: supersecreto123`
* Filtra con un IF: `{{$json.deliverability === 'DELIVERABLE'}}`
