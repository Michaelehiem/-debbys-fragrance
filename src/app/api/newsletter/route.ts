import { NextResponse } from "next/server";
import { addSubscriber, getSubscribers } from "@/lib/store";
import { isAdminRequest } from "@/lib/api-guard";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const subscribers = await getSubscribers();
    return NextResponse.json({ subscribers });
  } catch {
    return NextResponse.json({ error: "Failed to load subscribers" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = body.email?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  try {
    await addSubscriber(email);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 503 });
  }
}
