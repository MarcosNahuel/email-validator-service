const express = require("express");
const dns = require("dns").promises;
const SMTPConnection = require("nodemailer/lib/smtp-connection");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "";

function bad(res, msg, code=400){ return res.status(code).json({ok:false, reason:msg}); }

async function checkRcpt(host, email) {
  return await new Promise((resolve) => {
    const conn = new SMTPConnection({
      host, port: 25,
      ignoreTLS: false,   // si el server ofrece STARTTLS lo usa
      requireTLS: false,  // no forzamos, pero la mayoría lo exige igual
      tls: { rejectUnauthorized: false },
      connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 8000,
    });

    const done = (out) => { try{ conn.quit(); }catch{} resolve(out); };

    conn.connect(() => {
      conn.mail({ from: "" }, (err) => {
        if (err) return done({ status: "unknown", code: "smtp_mailfrom_err", err });
        conn.rcpt({ to: email }, (err2) => {
          if (!err2) return done({ status: "ok" });
          const c = err2 && err2.responseCode || 0;
          if (c === 550 || c === 551 || c === 553) return done({ status: "undeliverable", code: c });
          if (String(c).startsWith("4")) return done({ status: "risky", code: c });
          return done({ status: "unknown", code: c || "smtp_rcpt_err" });
        });
      });
    });

    conn.on("error", (e) => done({ status: "unknown", code: "smtp_conn_err", err: e }));
  });
}

app.get("/health", (_,res)=>res.json({ok:true}));

app.get("/validate", async (req, res) => {
  if (!API_KEY || req.header("x-api-key") !== API_KEY) return bad(res,"unauthorized",401);
  const email = (req.query.email||"").trim().toLowerCase();
  if (!email) return bad(res,"missing email");

  try {
    const [, domain] = email.split("@");
    const mx = (await dns.resolveMx(domain)).sort((a,b)=>a.priority-b.priority);
    if (!mx.length) return res.json({ ok:true, email, deliverability:"UNDELIVERABLE", reason:"dns_nomx" });

    // probá en orden de prioridad
    for (const { exchange } of mx) {
      const r = await checkRcpt(exchange, email);
      if (r.status === "ok")       return res.json({ ok:true, email, deliverability:"DELIVERABLE",   reason:"smtp_250_rcpt" });
      if (r.status === "undeliverable") return res.json({ ok:true, email, deliverability:"UNDELIVERABLE", reason:`smtp_${r.code}` });
      if (r.status === "risky")    return res.json({ ok:true, email, deliverability:"RISKY",         reason:`smtp_${r.code}` });
      // si unknown, probamos el siguiente MX
    }
    return res.json({ ok:true, email, deliverability:"UNKNOWN", reason:"smtp_unknown_all_mx" });
  } catch (e) {
    return res.json({ ok:true, email, deliverability:"UNKNOWN", reason:"exception", error: String(e) });
  }
});

app.listen(PORT, ()=>console.log(`validator up on ${PORT}`));

