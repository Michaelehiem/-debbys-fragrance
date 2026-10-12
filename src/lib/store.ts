import type { Product } from "@/types";
import type {
  AdminNotification,
  Customer,
  Order,
  StoreSettings,
  Subscriber,
} from "@/types/store";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { INITIAL_PRODUCTS } from "@/data/products";
import { assertNoError, getSupabase } from "@/lib/supabase";

/**
 * Postgres-backed store.
 *
 * Replaces the localStorage-only data (products, admin edits) so admin changes are visible
 * to every customer, and backs the new orders / customers / subscribers / settings /
 * notifications tables. Reads and writes go through server-side route handlers only.
 *
 * Two invariants:
 * 1. An empty product catalogue is *seeded*, never treated as "delete everything".
 * 2. `save*` functions remain full-replace, implemented as upsert-then-delete-removed.
 */

const MAX_NOTIFICATIONS = 100;

/**
 * Raised when the store cannot be read at all. Read-modify-write callers must never fall
 * back to an empty list here: the write that follows would delete every existing record.
 */
export class StoreUnavailableError extends Error {
  constructor(key: string, cause?: unknown) {
    super(`Could not read "${key}" from the data store.`);
    this.name = "StoreUnavailableError";
    this.cause = cause;
  }
}

type Row = Record<string, unknown>;

/** PostgREST returns `numeric` as a JSON number, but guard against string coercion anyway. */
function num(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Normalises timestamptz to the ISO-8601 string shape the app's types expect. */
function iso(value: unknown): string {
  const date = typeof value === "string" ? new Date(value) : (value as Date);
  return date instanceof Date && !Number.isNaN(date.getTime())
    ? date.toISOString()
    : new Date().toISOString();
}

/* ------------------------------------------------------------------ products */

function toProductRow(p: Product, sortOrder: number) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand ?? "",
    tagline: p.tagline ?? "",
    description: p.description ?? "",
    category: p.category,
    fragrance_family: p.fragranceFamily,
    top_notes: p.topNotes ?? [],
    heart_notes: p.heartNotes ?? [],
    base_notes: p.baseNotes ?? [],
    sizes: p.sizes ?? [],
    images: p.images ?? [],
    rating: p.rating ?? 0,
    review_count: p.reviewCount ?? 0,
    is_best_seller: Boolean(p.isBestSeller),
    is_new_arrival: Boolean(p.isNewArrival),
    is_featured: Boolean(p.isFeatured),
    stock: p.stock ?? 0,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

function fromProductRow(r: Row): Product {
  const product: Product = {
    id: String(r.id),
    name: String(r.name),
    brand: String(r.brand ?? ""),
    tagline: String(r.tagline ?? ""),
    description: String(r.description ?? ""),
    category: r.category as Product["category"],
    fragranceFamily: r.fragrance_family as Product["fragranceFamily"],
    topNotes: (r.top_notes as string[] | null) ?? [],
    heartNotes: (r.heart_notes as string[] | null) ?? [],
    baseNotes: (r.base_notes as string[] | null) ?? [],
    sizes: (r.sizes as Product["sizes"] | null) ?? [],
    images: (r.images as string[] | null) ?? [],
    rating: num(r.rating),
    reviewCount: num(r.review_count),
    stock: num(r.stock),
  };
  if (r.is_best_seller) product.isBestSeller = true;
  if (r.is_new_arrival) product.isNewArrival = true;
  if (r.is_featured) product.isFeatured = true;
  return product;
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new StoreUnavailableError("products", error);

  const list = ((data ?? []) as Row[]).map(fromProductRow);
  if (list.length > 0) return list;

  await saveProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

export async function saveProducts(list: Product[]) {
  const supabase = getSupabase();

  if (list.length === 0) {
    const del = await supabase.from("products").delete().neq("id", "___none___");
    assertNoError(del, "Clear products");
    return;
  }

  const rows = list.map((p, i) => toProductRow(p, i));
  const upsert = await supabase.from("products").upsert(rows, { onConflict: "id" });
  assertNoError(upsert, "Write products");

  const keep = list.map((p) => p.id);
  const del = await supabase
    .from("products")
    .delete()
    .not("id", "in", `(${keep.map((id) => `"${id}"`).join(",")})`);
  assertNoError(del, "Prune products");
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw new StoreUnavailableError("products", error);
  return data ? fromProductRow(data as Row) : undefined;
}

export async function updateProducts(
  update: (products: Product[]) => Product[]
): Promise<Product[]> {
  const stored = await getProducts();
  const products = stored.length > 0 ? stored : INITIAL_PRODUCTS;
  const next = update(products);
  await saveProducts(next);
  return next;
}

/* -------------------------------------------------------------------- orders */

function toOrderRow(o: Order) {
  return {
    id: o.id,
    number: o.number,
    created_at: o.createdAt,
    status: o.status,
    payment_status: o.paymentStatus,
    payment_method: o.paymentMethod,
    items: o.items ?? [],
    subtotal: o.subtotal,
    shipping: o.shipping,
    total: o.total,
    customer: o.customer,
    customer_id: o.customerId ?? null,
    delivery: o.delivery,
  };
}

function fromOrderRow(r: Row): Order {
  const order: Order = {
    id: String(r.id),
    number: String(r.number),
    createdAt: iso(r.created_at),
    status: r.status as Order["status"],
    paymentStatus: r.payment_status as Order["paymentStatus"],
    paymentMethod: r.payment_method as Order["paymentMethod"],
    items: (r.items as Order["items"] | null) ?? [],
    subtotal: num(r.subtotal),
    shipping: num(r.shipping),
    total: num(r.total),
    customer: (r.customer as Order["customer"]) ?? { name: "", phone: "", email: "" },
    delivery: (r.delivery as Order["delivery"]) ?? {
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
    },
  };
  if (r.customer_id) order.customerId = String(r.customer_id);
  return order;
}

export async function getOrders(): Promise<Order[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new StoreUnavailableError("orders", error);
  return ((data ?? []) as Row[]).map(fromOrderRow);
}

export async function saveOrders(list: Order[]) {
  const supabase = getSupabase();

  if (list.length === 0) {
    const del = await supabase.from("orders").delete().neq("id", "___none___");
    assertNoError(del, "Clear orders");
    return;
  }

  const upsert = await supabase.from("orders").upsert(list.map(toOrderRow), { onConflict: "id" });
  assertNoError(upsert, "Write orders");

  const keep = list.map((o) => o.id);
  const del = await supabase
    .from("orders")
    .delete()
    .not("id", "in", `(${keep.map((id) => `"${id}"`).join(",")})`);
  assertNoError(del, "Prune orders");
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw new StoreUnavailableError("orders", error);
  return data ? fromOrderRow(data as Row) : undefined;
}

export async function addOrder(order: Order): Promise<void> {
  const supabase = getSupabase();
  assertNoError(await supabase.from("orders").insert(toOrderRow(order)), "Insert order");
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | undefined> {
  const existing = await getOrder(id);
  if (!existing) return undefined;
  const merged: Order = { ...existing, ...patch, id };
  const supabase = getSupabase();
  assertNoError(
    await supabase.from("orders").update(toOrderRow(merged)).eq("id", id),
    "Update order"
  );
  return merged;
}

/* ----------------------------------------------------------------- customers */

function toCustomerRow(c: Customer) {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone ?? "",
    password_hash: c.passwordHash,
    address: c.address ?? null,
    cart: c.cart ?? [],
    created_at: c.createdAt,
  };
}

function fromCustomerRow(r: Row): Customer {
  const customer: Customer = {
    id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    phone: String(r.phone ?? ""),
    passwordHash: String(r.password_hash),
    cart: (r.cart as Customer["cart"] | null) ?? [],
    createdAt: iso(r.created_at),
  };
  const address = r.address as Customer["address"];
  if (address?.address) customer.address = address;
  return customer;
}

export async function getCustomers(): Promise<Customer[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new StoreUnavailableError("customers", error);
  return ((data ?? []) as Row[]).map(fromCustomerRow);
}

export async function getCustomerByEmail(email: string): Promise<Customer | undefined> {
  const needle = email.trim().toLowerCase();
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .ilike("email", needle)
    .maybeSingle();
  if (error) throw new StoreUnavailableError("customers", error);
  return data ? fromCustomerRow(data as Row) : undefined;
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();
  if (error) throw new StoreUnavailableError("customers", error);
  return data ? fromCustomerRow(data as Row) : undefined;
}

export async function addCustomer(customer: Customer): Promise<void> {
  const supabase = getSupabase();
  assertNoError(await supabase.from("customers").insert(toCustomerRow(customer)), "Insert customer");
}

export async function updateCustomer(id: string, patch: Partial<Customer>): Promise<void> {
  const supabase = getSupabase();
  const row: Row = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.address !== undefined) row.address = patch.address ?? null;
  if (patch.cart !== undefined) row.cart = patch.cart;
  if (patch.passwordHash !== undefined) row.password_hash = patch.passwordHash;
  if (Object.keys(row).length === 0) return;
  assertNoError(await supabase.from("customers").update(row).eq("id", id), "Update customer");
}

/* --------------------------------------------------------------- subscribers */

function toSubscriberRow(s: Subscriber) {
  return { id: s.id, email: s.email, created_at: s.createdAt };
}

function fromSubscriberRow(r: Row): Subscriber {
  return { id: String(r.id), email: String(r.email), createdAt: iso(r.created_at) };
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new StoreUnavailableError("subscribers", error);
  return ((data ?? []) as Row[]).map(fromSubscriberRow);
}

export async function addSubscriber(email: string): Promise<Subscriber> {
  const supabase = getSupabase();
  const existing = await supabase
    .from("subscribers")
    .select("*")
    .ilike("email", email.trim().toLowerCase())
    .maybeSingle();
  if (existing.data) return fromSubscriberRow(existing.data as Row);
  const sub: Subscriber = {
    id: `s-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    email: email.trim(),
    createdAt: new Date().toISOString(),
  };
  assertNoError(await supabase.from("subscribers").insert(toSubscriberRow(sub)), "Insert subscriber");
  return sub;
}

/* ------------------------------------------------------------------ settings */

export async function getSettings(): Promise<StoreSettings> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw new StoreUnavailableError("store_settings", error);
  if (!data) return { ...DEFAULT_SETTINGS };

  const r = data as Row;
  return {
    ...DEFAULT_SETTINGS,
    name: String(r.name ?? DEFAULT_SETTINGS.name),
    tagline: String(r.tagline ?? DEFAULT_SETTINGS.tagline),
    supportEmail: String(r.support_email ?? DEFAULT_SETTINGS.supportEmail),
    phone: String(r.phone ?? DEFAULT_SETTINGS.phone),
    whatsappNumber: String(r.whatsapp_number ?? DEFAULT_SETTINGS.whatsappNumber),
    address: String(r.address ?? ""),
    currency: String(r.currency ?? DEFAULT_SETTINGS.currency),
    facebook: String(r.facebook ?? ""),
    instagram: String(r.instagram ?? ""),
    tiktok: String(r.tiktok ?? ""),
    ...(r.admin_password ? { adminPassword: String(r.admin_password) } : {}),
  };
}

export async function saveSettings(settings: StoreSettings) {
  const supabase = getSupabase();
  const row = {
    id: true,
    name: settings.name,
    tagline: settings.tagline,
    support_email: settings.supportEmail,
    phone: settings.phone,
    whatsapp_number: settings.whatsappNumber,
    address: settings.address,
    currency: settings.currency,
    facebook: settings.facebook,
    instagram: settings.instagram,
    tiktok: settings.tiktok,
    admin_password: settings.adminPassword ?? null,
    updated_at: new Date().toISOString(),
  };
  assertNoError(
    await supabase.from("store_settings").upsert(row, { onConflict: "id" }),
    "Write store_settings"
  );
}

/* ------------------------------------------------------------ notifications */

function toNotificationRow(n: AdminNotification) {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    target: n.target,
    created_at: n.createdAt,
    is_read: n.read,
  };
}

function fromNotificationRow(r: Row): AdminNotification {
  return {
    id: String(r.id),
    type: r.type as AdminNotification["type"],
    title: String(r.title ?? ""),
    body: String(r.body ?? ""),
    target: (r.target as AdminNotification["target"]) ?? "orders",
    createdAt: iso(r.created_at),
    read: Boolean(r.is_read),
  };
}

export async function getNotifications(): Promise<AdminNotification[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("admin_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(MAX_NOTIFICATIONS);
  if (error) throw new StoreUnavailableError("admin_notifications", error);
  return ((data ?? []) as Row[]).map(fromNotificationRow);
}

/** Appends an admin notification (new order, complaint/escalation). Never throws. */
export async function addNotification(
  input: Omit<AdminNotification, "id" | "createdAt" | "read">
): Promise<AdminNotification | null> {
  try {
    const notification: AdminNotification = {
      id: `n-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...input,
    };
    const supabase = getSupabase();
    assertNoError(
      await supabase.from("admin_notifications").insert(toNotificationRow(notification)),
      "Insert admin_notification"
    );
    return notification;
  } catch (err) {
    console.error("Failed to record notification:", err);
    return null;
  }
}

export async function markNotificationsRead(ids?: string[]): Promise<AdminNotification[]> {
  const supabase = getSupabase();
  const query = supabase.from("admin_notifications").update({ is_read: true });
  assertNoError(
    await (ids && ids.length > 0 ? query.in("id", ids) : query),
    "Mark notifications read"
  );
  return getNotifications();
}
