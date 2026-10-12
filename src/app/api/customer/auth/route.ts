import { NextResponse } from "next/server";
import {
  CUSTOMER_SESSION_COOKIE,
  createCustomerSessionToken,
  hashPassword,
  toPublicCustomer,
  verifyPassword,
} from "@/lib/customer-auth";
import { readCustomerId } from "@/lib/api-guard";
import {
  addCustomer,
  getCustomerByEmail,
  getCustomerById,
  updateCustomer,
} from "@/lib/store";
import type { Customer, SavedAddress } from "@/types/store";

export const dynamic = "force-dynamic";

const MAX_AGE = 60 * 60 * 24 * 30;

function setSession(res: NextResponse, customerId: string) {
  res.cookies.set({
    name: CUSTOMER_SESSION_COOKIE,
    value: createCustomerSessionToken(customerId),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

function clearSession(res: NextResponse) {
  res.cookies.set({
    name: CUSTOMER_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function GET(request: Request) {
  const id = readCustomerId(request);
  if (!id) return NextResponse.json({ customer: null });
  try {
    const customer = await getCustomerById(id);
    return NextResponse.json({ customer: customer ? toPublicCustomer(customer) : null });
  } catch {
    return NextResponse.json({ customer: null });
  }
}

export async function POST(request: Request) {
  let body: {
    action?: string;
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    address?: SavedAddress;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body.action;

  try {
    if (action === "register") {
      const name = body.name?.trim();
      const email = body.email?.trim().toLowerCase();
      const phone = body.phone?.trim() ?? "";
      const password = body.password ?? "";
      if (!name || !email || password.length < 6) {
        return NextResponse.json(
          { error: "Name, email and a password of at least 6 characters are required" },
          { status: 400 }
        );
      }
      if (await getCustomerByEmail(email)) {
        return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
      }
      const customer: Customer = {
        id: `c-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
        name,
        email,
        phone,
        passwordHash: await hashPassword(password),
        cart: [],
        createdAt: new Date().toISOString(),
      };
      await addCustomer(customer);
      const res = NextResponse.json({ customer: toPublicCustomer(customer) }, { status: 201 });
      setSession(res, customer.id);
      return res;
    }

    if (action === "login") {
      const email = body.email?.trim().toLowerCase() ?? "";
      const password = body.password ?? "";
      const customer = await getCustomerByEmail(email);
      if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
      const res = NextResponse.json({ customer: toPublicCustomer(customer) });
      setSession(res, customer.id);
      return res;
    }

    if (action === "logout") {
      const res = NextResponse.json({ ok: true });
      clearSession(res);
      return res;
    }

    if (action === "update") {
      const id = readCustomerId(request);
      if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const patch: { name?: string; phone?: string; address?: SavedAddress } = {};
      if (body.name !== undefined) patch.name = body.name.trim();
      if (body.phone !== undefined) patch.phone = body.phone.trim();
      if (body.address !== undefined) patch.address = body.address;
      await updateCustomer(id, patch);
      const customer = await getCustomerById(id);
      return NextResponse.json({ customer: customer ? toPublicCustomer(customer) : null });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Account request failed" }, { status: 503 });
  }
}
