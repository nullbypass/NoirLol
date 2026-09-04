import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';
const key = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-change-me');
export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('30d').sign(key);
  (await cookies()).set('session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60*60*24*30 });
}
export async function clearSession() { (await cookies()).set('session', '', { httpOnly:true, path:'/', maxAge:0 }); }
export async function currentUser() {
  const token = (await cookies()).get('session')?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, key); return payload.sub ? db.user.findUnique({ where:{ id: payload.sub }, include:{ profile:true } }) : null; }
  catch { return null; }
}
