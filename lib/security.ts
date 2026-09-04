import crypto from 'crypto';
export const reserved = new Set(['api','dashboard','login','register','admin','settings','assets','uploads','h','u']);
export function validUsername(v:string){ return /^[a-z0-9_.-]{2,32}$/i.test(v) && !reserved.has(v.toLowerCase()); }
export function hashIp(ip:string){ return crypto.createHmac('sha256', process.env.IP_HASH_SECRET || 'dev-ip-secret').update(ip).digest('hex'); }
export function safeUrl(v:string){
  try { const u = new URL(v); return ['http:','https:'].includes(u.protocol); } catch { return false; }
}
