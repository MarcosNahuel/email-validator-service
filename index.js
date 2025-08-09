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
  const re = /^[^
@]+@[^
@]+\.[^
@]{2,}$/;
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