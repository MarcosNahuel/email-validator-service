// index.js
const express = require("express");
const dns = require("dns").promises;
const SMTPConnection = require("smtp-connection"); // <— paquete correcto

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "";

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
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
      // logger: true,       // descomenta para ver wirelog
    });

    const finish = (status, code, err) => {
      try {
        conn.quit();
      } catch {}
      resolve({ status, code, err: err && String(err) });
    };

    conn.on("error", (e) => finish("unknown", "smtp_conn_err", e));

    conn.connect(() => {
      conn.mail({ from: "" }, (err) => {
        if (err) return finish("unknown", "smtp_mailfrom_err", err);
        conn.rcpt({ to: email }, (err2) => {
          if (!err2) return finish("ok", 250);
          const c = err2.responseCode || 0;
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
app.get("/health", (_, res) => res.json({ ok: true, version: "starttls-v3" }));

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
  if (!API_KEY || req.header("x-api-key") !== API_KEY)
    return bad(res, "unauthorized", 401);
  return handleValidate(req.query.email, res);
});

// POST /validate  { "email": "..." }
app.post("/validate", async (req, res) => {
  if (!API_KEY || req.header("x-api-key") !== API_KEY)
    return bad(res, "unauthorized", 401);
  return handleValidate(req.body && req.body.email, res);
});

app.listen(PORT, () => console.log(`validator up on ${PORT}`));
