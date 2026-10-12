import crypto from "node:crypto";
import { promisify } from "node:util";
import { sessionSecret } from "@/lib/auth";
import type { PublicCustomer, SavedAddress } from "@/types/store";

export const CUSTOMER_SESSION_COOKIE = "debby_customer_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const SCRYPT_KEYLEN = 64;

const scrypt = promisify(crypto.scrypt) as (
  password: crypto.BinaryLike,
  salt: crypto.BinaryLike,
  keylen: number
) => Promise<Buffer>;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, SCRYPT_KEYLEN);
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const candidate = await scrypt(password, salt, SCRYPT_KEYLEN);
    const expected = Buffer.from(hash, "hex");
    if (candidate.length !== expected.length) return false;
    return crypto.timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}

export function createCustomerSessionToken(sub: string) {
  const payload = Buffer.from(
    JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyCustomerSessionToken(
  token: string | undefined | null
): { sub: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto
    .createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
  if (sig !== expected) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub?: string;
      exp?: number;
    };
    if (!data.sub || typeof data.exp !== "number") return null;
    if (data.exp <= Math.floor(Date.now() / 1000)) return null;
    return { sub: data.sub };
  } catch {
    return null;
  }
}

export function toPublicCustomer(c: {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: SavedAddress;
}): PublicCustomer {
  const out: PublicCustomer = { id: c.id, name: c.name, email: c.email, phone: c.phone };
  if (c.address?.address) out.address = c.address;
  return out;
}
