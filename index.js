// index.js
const express = require("express");
const dns = require("dns").promises;
const SMTPConnection = require("smtp-connection");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "";

// Validar que la API_KEY esté configurada
if (!API_KEY) {
  console.error("ERROR: API_KEY environment variable is required!");
  console.error("Please set API_KEY in your environment variables");
  process.exit(1);
}

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`
  );
  next();
});

// helper: misma forma de salida que venías usando (array con un objeto)
function out(res, email, deliverability, reason, extra = {}) {
  return res.json([{ ok: true, email, deliverability, reason, ...extra }]);
}

function bad(res, msg, code = 400) {
  return res.status(code).json([{ ok: false, reason: msg }]);
}

// chequeo RCPT TO con STARTTLS si el servidor lo ofrece
async function checkRcpt(host, email) {
  return await new Promise((resolve) => {
    const conn = new SMTPConnection({
      host,
      port: 25,
      ignoreTLS: false, // si el server ofrece STARTTLS, lo usa
      requireTLS: false, // no forzamos; muchos MX lo piden igual
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000, // aumentado a 10 segundos
      greetingTimeout: 10000,
      socketTimeout: 10000,
      // logger: true,       // descomenta para ver wirelog
    });

    const finish = (status, code, err) => {
      try {
        conn.quit();
      } catch {}
      resolve({ status, code, err: err && String(err) });
    };

    conn.on("error", (e) => {
      console.log(`SMTP connection error to ${host}: ${e.message}`);
      finish("unknown", "smtp_conn_err", e);
    });

    conn.connect(() => {
      conn.mail({ from: "" }, (err) => {
        if (err) {
          console.log(`SMTP MAIL FROM error to ${host}: ${err.message}`);
          return finish("unknown", "smtp_mailfrom_err", err);
        }
        conn.rcpt({ to: email }, (err2) => {
          if (!err2) {
            console.log(`SMTP RCPT TO success for ${email} at ${host}`);
            return finish("ok", 250);
          }
          const c = err2.responseCode || 0;
          console.log(
            `SMTP RCPT TO error for ${email} at ${host}: ${c} - ${err2.message}`
          );
          if (c === 550 || c === 551 || c === 553)
            return finish("undeliverable", c);
          if (String(c).startsWith("4")) return finish("risky", c); // 4xx temporales
          return finish("unknown", c || "smtp_rcpt_err", err2);
        });
      });
    });
  });
}

// health con version para comprobar el despliegue
app.get("/health", (_, res) => {
  console.log("Health check requested");
  res.json({
    ok: true,
    version: "1.0.7",
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!API_KEY,
  });
});

// lógica compartida GET/POST
async function handleValidate(email, res) {
  const clean = (email || "").trim().toLowerCase();
  if (!clean || !clean.includes("@")) return bad(res, "missing email");

  try {
    const domain = clean.split("@")[1];
    const mx = (await dns.resolveMx(domain)).sort(
      (a, b) => a.priority - b.priority
    );
    if (!mx.length) return out(res, clean, "UNDELIVERABLE", "dns_nomx");

    // probamos MX por prioridad; devolvemos al primer resultado concluyente
    for (const { exchange } of mx) {
      const r = await checkRcpt(exchange, clean);
      if (r.status === "ok")
        return out(res, clean, "DELIVERABLE", "smtp_250_rcpt");
      if (r.status === "undeliverable")
        return out(res, clean, "UNDELIVERABLE", `smtp_${r.code}`);
      if (r.status === "risky")
        return out(res, clean, "RISKY", `smtp_${r.code}`);
      // si "unknown", seguimos probando con el siguiente MX
    }
    return out(res, clean, "UNKNOWN", "smtp_unknown_all_mx");
  } catch (e) {
    return out(res, clean, "UNKNOWN", "exception", { error: String(e) });
  }
}

// GET /validate?email=...
app.get("/validate", async (req, res) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey) {
    console.log("Missing x-api-key header");
    return bad(res, "missing x-api-key header", 401);
  }

  if (apiKey !== API_KEY) {
    console.log("Invalid API key provided");
    return bad(res, "unauthorized", 401);
  }

  console.log("Validating email via GET request");
  return handleValidate(req.query.email, res);
});

// POST /validate  { "email": "..." }
app.post("/validate", async (req, res) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey) {
    console.log("Missing x-api-key header");
    return bad(res, "missing x-api-key header", 401);
  }

  if (apiKey !== API_KEY) {
    console.log("Invalid API key provided");
    return bad(res, "unauthorized", 401);
  }

  console.log("Validating email via POST request");
  return handleValidate(req.body && req.body.email, res);
});

// Ruta de prueba para verificar que el servicio está funcionando
app.get("/", (_, res) => {
  res.json({
    message: "Email Validator Service",
    version: "1.0.7",
    endpoints: {
      health: "/health",
      validate: "/validate?email=test@example.com",
      validatePost: "POST /validate with JSON body",
    },
    status: "running",
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json([{ ok: false, reason: "Internal server error" }]);
});

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json([{ ok: false, reason: "Endpoint not found" }]);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Email Validator Service started successfully!`);
  console.log(`📍 Listening on 0.0.0.0:${PORT}`);
  console.log(`🔑 API Key configured: ${API_KEY ? "Yes" : "No"}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`✅ Ready to validate emails!`);
});
