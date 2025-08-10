const express = require("express");
const dns = require("dns").promises;
const SMTPConnection = require("nodemailer/lib/smtp-connection");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "";

function bad(res, msg, code = 400) {
  return res.status(code).json({ ok: false, reason: msg });
}

async function checkRcpt(host, email) {
  return await new Promise((resolve) => {
    const conn = new SMTPConnection({
      host,
      port: 25,
      // Usar STARTTLS cuando el servidor lo ofrezca:
      ignoreTLS: false,
      requireTLS: false,
      tls: { rejectUnauthorized: false },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
      // logger: true, // <- descomenta si quieres ver el wirelog
    });

    const finish = (out) => {
      try {
        conn.quit();
      } catch {}
      resolve(out);
    };
    conn.on("error", (e) =>
      finish({ status: "unknown", code: "smtp_conn_err", err: String(e) })
    );

    conn.connect(() => {
      conn.mail({ from: "" }, (err) => {
        if (err)
          return finish({
            status: "unknown",
            code: "smtp_mailfrom_err",
            err: String(err),
          });
        conn.rcpt({ to: email }, (err2) => {
          if (!err2) return finish({ status: "ok", code: 250 });
          const c = err2.responseCode || 0;
          if (c === 550 || c === 551 || c === 553)
            return finish({ status: "undeliverable", code: c });
          if (String(c).startsWith("4"))
            return finish({ status: "risky", code: c }); // temporales (greylist, etc.)
          return finish({ status: "unknown", code: c || "smtp_rcpt_err" });
        });
      });
    });
  });
}

app.get("/health", (_, res) => res.json({ ok: true }));

app.get("/validate", async (req, res) => {
  if (!API_KEY || req.header("x-api-key") !== API_KEY)
    return bad(res, "unauthorized", 401);
  const email = (req.query.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) return bad(res, "missing email");

  try {
    const domain = email.split("@")[1];
    const mx = (await dns.resolveMx(domain)).sort(
      (a, b) => a.priority - b.priority
    );
    if (!mx.length)
      return res.json({
        ok: true,
        email,
        deliverability: "UNDELIVERABLE",
        reason: "dns_nomx",
      });

    for (const { exchange } of mx) {
      const r = await checkRcpt(exchange, email);
      if (r.status === "ok")
        return res.json({
          ok: true,
          email,
          deliverability: "DELIVERABLE",
          reason: "smtp_250_rcpt",
        });
      if (r.status === "undeliverable")
        return res.json({
          ok: true,
          email,
          deliverability: "UNDELIVERABLE",
          reason: `smtp_${r.code}`,
        });
      if (r.status === "risky")
        return res.json({
          ok: true,
          email,
          deliverability: "RISKY",
          reason: `smtp_${r.code}`,
        });
      // si unknown, probamos el siguiente MX
    }
    return res.json({
      ok: true,
      email,
      deliverability: "UNKNOWN",
      reason: "smtp_unknown_all_mx",
    });
  } catch (e) {
    return res.json({
      ok: true,
      email,
      deliverability: "UNKNOWN",
      reason: "exception",
      error: String(e),
    });
  }
});

app.listen(PORT, () => console.log(`validator up on ${PORT}`));
