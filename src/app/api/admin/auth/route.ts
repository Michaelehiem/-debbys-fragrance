import { NextResponse } from "next/server";
import { SESSION_COOKIE, createSessionToken, passwordMatches } from "@/lib/auth";
import { isAdminRequest } from "@/lib/api-guard";

export const dynamic = "force-dynamic";

const MAX_AGE = 60 * 60 * 12;

export async function GET(request: Request) {
  return NextResponse.json({ authenticated: await isAdminRequest(request) });
}

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const password = body.password ?? "";
  let ok = false;
  try {
    ok = await passwordMatches(password);
  } catch {
    ok = false;
  }
  if (!ok) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
