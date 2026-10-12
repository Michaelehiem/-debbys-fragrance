import crypto from "node:crypto";
import { ADMIN_SESSION_SECRET_ENV } from "@/lib/constants";
import { getSettings } from "@/lib/store";

export const SESSION_COOKIE = "debby_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export function sessionSecret(): string {
  const s = process.env[ADMIN_SESSION_SECRET_ENV];
  if (!s || s.length < 16) {
    throw new Error(`${ADMIN_SESSION_SECRET_ENV} must be set to a value of at least 16 characters.`);
  }
  return s;
}

export function createSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({ sub: "admin", exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS })
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  if (sig !== expected) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number;
    };
    return typeof data.exp === "number" && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function passwordMatches(candidate: string): Promise<boolean> {
  let stored: string | undefined;
  try {
    const settings = await getSettings();
    stored = settings.adminPassword?.trim() || process.env.ADMIN_PASSWORD;
  } catch {
    stored = process.env.ADMIN_PASSWORD;
  }
  if (!stored) return false;
  const a = Buffer.from(stored);
  const b = Buffer.from(candidate);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
