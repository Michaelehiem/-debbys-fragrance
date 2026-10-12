import { NextResponse } from "next/server";
import { getNotifications, markNotificationsRead } from "@/lib/store";
import { isAdminRequest } from "@/lib/api-guard";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const notifications = await getNotifications();
    return NextResponse.json({ notifications });
  } catch {
    return NextResponse.json({ error: "Failed to load notifications" }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { ids?: string[] } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  try {
    const notifications = await markNotificationsRead(body.ids);
    return NextResponse.json({ notifications });
  } catch {
    return NextResponse.json({ error: "Failed to mark notifications" }, { status: 503 });
  }
}
