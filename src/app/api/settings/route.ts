import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/store";
import { isAdminRequest } from "@/lib/api-guard";
import type { StoreSettings } from "@/types/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSettings();
    const { adminPassword: _omit, ...publicSettings } = settings;
    return NextResponse.json({ settings: publicSettings });
  } catch {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { settings?: Partial<StoreSettings> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const current = await getSettings();
    const next: StoreSettings = { ...current, ...(body.settings ?? {}) };
    // Never let an empty string blank out the admin password override.
    if (!next.adminPassword) delete next.adminPassword;
    await saveSettings(next);
    const { adminPassword: _omit, ...publicSettings } = next;
    return NextResponse.json({ settings: publicSettings });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 503 });
  }
}
