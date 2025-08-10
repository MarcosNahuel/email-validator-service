import isemail from 'isemail';
import punycode from 'punycode';
import { isDisposable } from '../services/disposable.service.js';
import { config } from '../config.js';

const roleAccounts = new Set<string>([
  'admin',
  'administrator',
  'webmaster',
  'hostmaster',
  'postmaster',
  'abuse',
  'support',
  'help',
  'info',
  'sales',
  'contact',
  'billing',
  'security',
  'noreply',
  'no-reply',
  'marketing',
  'feedback',
  'root',
  'sysadmin',
]);

export interface SyntaxCheckResult {
  normalized: string;
  valid_syntax: boolean;
  is_disposable: boolean;
  is_role: boolean;
  domain: string;
  reason?: 'invalid_syntax' | 'disposable_email' | 'role_email';
}

export function checkSyntax(email: string): SyntaxCheckResult {
  const lowercasedEmail = email.toLowerCase().trim();
  const parts = lowercasedEmail.split('@');
  if (parts.length !== 2) {
    return {
      normalized: email,
      valid_syntax: false,
      is_disposable: false,
      is_role: false,
      domain: '',
      reason: 'invalid_syntax',
    };
  }

  let [local, domain] = parts;

  try {
    domain = punycode.toASCII(domain);
  } catch {
    return {
      normalized: `${local}@${domain}`,
      valid_syntax: false,
      is_disposable: false,
      is_role: false,
      domain,
      reason: 'invalid_syntax',
    };
  }

  const normalized = `${local}@${domain}`;

  const valid_syntax = isemail.validate(normalized, {
    errorLevel: false,
  } as any);
  if (!valid_syntax) {
    return {
      normalized,
      valid_syntax,
      is_disposable: false,
      is_role: false,
      domain,
      reason: 'invalid_syntax',
    };
  }

  const is_disposable = isDisposable(domain);
  if (is_disposable) {
    return {
      normalized,
      valid_syntax,
      is_disposable,
      is_role: false,
      domain,
      reason: 'disposable_email',
    };
  }

  const is_role = config.BLOCK_ROLES && roleAccounts.has(local);
  if (is_role) {
    return {
      normalized,
      valid_syntax,
      is_disposable,
      is_role,
      domain,
      reason: 'role_email',
    };
  }

  return { normalized, valid_syntax, is_disposable, is_role, domain };
}
