import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';

// Simple password gate for /admin. Set ADMIN_PASSWORD in .env.local; defaults
// to "philosopher" for local dev (warned in the UI). This is a lightweight
// gate, not full RBAC — real auth arrives with accounts in Phase 3.
export const ADMIN_COOKIE = 'pm_admin';

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'philosopher';
}

export function usingDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD;
}

/** Opaque token stored in the cookie — sha256 of the password + a salt. */
export function adminToken(): string {
  return createHash('sha256').update(`pm:${adminPassword()}:admin`).digest('hex');
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === adminToken();
}
