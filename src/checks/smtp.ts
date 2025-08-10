import SMTPConnection from 'smtp-connection';
import { config } from '../config.js';

export interface SmtpCheckResult {
  enabled: boolean;
  connection: 'ok' | 'timeout' | 'blocked' | 'error' | 'not_checked';
  deliverable: boolean;
  catch_all_suspected: boolean;
  notes: string;
}

async function rcptProbe(
  mx: string,
  email: string,
): Promise<{
  status: 'ok' | 'undeliverable' | 'risky' | 'timeout' | 'blocked' | 'error';
  code?: number;
  note?: string;
}> {
  return await new Promise((resolve) => {
    const conn = new SMTPConnection({
      host: mx,
      port: 25,
      ignoreTLS: false,
      requireTLS: false,
      tls: { rejectUnauthorized: false },
      connectionTimeout: config.SMTP_TIMEOUT_MS,
      greetingTimeout: config.SMTP_TIMEOUT_MS,
      socketTimeout: config.SMTP_TIMEOUT_MS,
    });

    const finish = (
      status:
        | 'ok'
        | 'undeliverable'
        | 'risky'
        | 'timeout'
        | 'blocked'
        | 'error',
      code?: number,
      note?: string,
    ) => {
      try {
        conn.quit();
      } catch {}
      resolve({ status, code, note });
    };

    conn.on('error', (e: any) => {
      if (e?.code === 'ECONNREFUSED' || e?.code === 'EHOSTUNREACH')
        return finish('blocked', undefined, String(e?.code || e?.message));
      if (
        String(e?.message || '')
          .toLowerCase()
          .includes('timeout')
      )
        return finish('timeout', undefined, 'timeout');
      return finish('error', undefined, e?.message);
    });

    conn.connect(() => {
      conn.mail({ from: config.SMTP_FROM_EMAIL }, (err: any) => {
        if (err) return finish('error', undefined, `MAIL FROM ${err.message}`);
        conn.rcpt({ to: email }, (err2: any) => {
          if (!err2) return finish('ok', 250, 'RCPT accepted');
          const c = err2.responseCode || 0;
          if (c === 550 || c === 551 || c === 553)
            return finish('undeliverable', c, 'hard bounce');
          if (String(c).startsWith('4'))
            return finish('risky', c, 'soft bounce / greylisting');
          return finish('error', c, err2.message);
        });
      });
    });
  });
}

async function detectCatchAll(mx: string, domain: string): Promise<boolean> {
  const randomUser = `no-reply-${Date.now()}${Math.random().toString(36).substring(2, 8)}`;
  const randomEmail = `${randomUser}@${domain}`;
  const res = await rcptProbe(mx, randomEmail);
  return res.status === 'ok';
}

export async function checkSmtp(
  mxRecords: string[],
  email: string,
  domain: string,
): Promise<SmtpCheckResult> {
  if (!config.ENABLE_SMTP_PROBE || mxRecords.length === 0) {
    return {
      enabled: config.ENABLE_SMTP_PROBE,
      connection: 'not_checked',
      deliverable: false,
      catch_all_suspected: false,
      notes: 'SMTP probe disabled or no MX records found.',
    };
  }
  // En hosts que bloquean puerto 25: permitir operar sin SMTP y sin penalizar el score
  if (process.env.FORCE_SMTP_BLOCKED === 'true') {
    return {
      enabled: false,
      connection: 'not_checked',
      deliverable: false,
      catch_all_suspected: false,
      notes: 'SMTP probing forcibly disabled by env',
    };
  }

  let finalConnection: SmtpCheckResult['connection'] = 'error';
  let deliverable = false;
  let notes = 'Could not connect to any mail server.';

  for (const mx of mxRecords.slice(0, 3)) {
    const res = await rcptProbe(mx, email);
    if (res.status === 'ok') {
      finalConnection = 'ok';
      deliverable = true;
      notes = res.note || 'OK';
      break;
    }
    if (res.status === 'undeliverable') {
      finalConnection = 'ok';
      deliverable = false;
      notes = `RCPT rejected (${res.code})`;
      break;
    }
    if (res.status === 'risky') {
      finalConnection = 'ok';
      deliverable = false;
      notes = `Temporary rejection (${res.code})`;
      break;
    }
    if (res.status === 'timeout') {
      finalConnection = 'timeout';
      deliverable = false;
      notes = 'timeout';
    } else if (res.status === 'blocked') {
      finalConnection = 'blocked';
      deliverable = false;
      notes = 'blocked';
    } else if (res.status === 'error') {
      finalConnection = 'error';
      deliverable = false;
      notes = res.note || 'error';
    }
  }

  let catch_all_suspected = false;
  if (deliverable && mxRecords.length > 0) {
    try {
      catch_all_suspected = await detectCatchAll(mxRecords[0], domain);
      if (catch_all_suspected) {
        notes += ' Domain may be a catch-all.';
      }
    } catch {
      // ignore
    }
  }

  return {
    enabled: true,
    connection: finalConnection,
    deliverable,
    catch_all_suspected,
    notes,
  };
}
