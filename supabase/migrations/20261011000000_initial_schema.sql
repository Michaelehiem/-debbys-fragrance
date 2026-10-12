-- Debby's Fragrance store schema.
--
-- Moves the previously localStorage-only data (products, admin edits) into Postgres so
-- admin changes are visible to every customer, and adds the tables the storefront needs
-- for order tracking, customer accounts, saved carts, settings and admin notifications.
--
-- Access model: every read and write goes through server-side route handlers using the
-- service_role key. Nothing in `src/` talks to Supabase from the browser, so RLS is enabled
-- on every table with *no* policies for anon/authenticated. That is deliberate: with RLS on
-- and zero policies, every direct-from-browser request is rejected, and the service_role key
-- bypasses RLS so server code keeps working. Do not add permissive policies without a reason.

create table if not exists public.products (
  id text primary key,
  name text not null,
  brand text not null default '',
  tagline text not null default '',
  description text not null default '',
  category text not null default 'women'
    check (category in ('men', 'women', 'unisex')),
  fragrance_family text not null default 'floral',
  -- string[]
  top_notes jsonb not null default '[]'::jsonb,
  -- string[]
  heart_notes jsonb not null default '[]'::jsonb,
  -- string[]
  base_notes jsonb not null default '[]'::jsonb,
  -- ProductSize[]: [{ size, price, originalPrice? }]
  sizes jsonb not null default '[]'::jsonb,
  -- string[]
  images jsonb not null default '[]'::jsonb,
  rating numeric(3, 2) not null default 0,
  review_count integer not null default 0,
  is_best_seller boolean not null default false,
  is_new_arrival boolean not null default false,
  is_featured boolean not null default false,
  stock integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_sort_order_idx on public.products (sort_order);

create table if not exists public.orders (
  id text primary key,
  number text not null unique,
  created_at timestamptz not null default now(),
  status text not null default 'PENDING'
    check (status in ('PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
  payment_status text not null default 'PENDING'
    check (payment_status in ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
  payment_method text not null default 'whatsapp'
    check (payment_method in ('card', 'bank_transfer', 'cash_on_delivery', 'whatsapp')),
  -- OrderItem[]: [{ productId, name, price, qty, image, size }]
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12, 2) not null default 0,
  shipping numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  -- CustomerInfo: { name, phone, email }
  customer jsonb not null default '{}'::jsonb,
  -- Set server-side from the signed-in session; null for guest checkout.
  customer_id text,
  -- DeliveryInfo: { address, city, state, country, instructions? }
  delivery jsonb not null default '{}'::jsonb
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_customer_id_idx on public.orders (customer_id);

create table if not exists public.customers (
  id text primary key,
  name text not null,
  email text not null unique,
  phone text not null default '',
  -- scrypt, stored as "salt:hex" by hashPassword() in src/lib/customer-auth.ts.
  password_hash text not null,
  -- SavedAddress: { address, city, state, country }
  address jsonb,
  -- CartItem[] (saved cart)
  cart jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists customers_email_lower_idx on public.customers (lower(email));

create table if not exists public.subscribers (
  id text primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Single-row table. getSettings() merges this row over DEFAULT_SETTINGS.
create table if not exists public.store_settings (
  id boolean primary key default true check (id),
  name text not null default '',
  tagline text not null default '',
  support_email text not null default '',
  phone text not null default '',
  whatsapp_number text not null default '',
  address text not null default '',
  currency text not null default '',
  facebook text not null default '',
  instagram text not null default '',
  tiktok text not null default '',
  -- Stored override of the ADMIN_PASSWORD env var, set from the admin Settings tab.
  admin_password text,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_notifications (
  id text primary key,
  type text not null check (type in ('order', 'complaint')),
  title text not null,
  body text not null default '',
  target text not null default 'orders',
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

create index if not exists admin_notifications_created_at_idx
  on public.admin_notifications (created_at desc);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.customers enable row level security;
alter table public.subscribers enable row level security;
alter table public.store_settings enable row level security;
alter table public.admin_notifications enable row level security;

-- Intentionally no policies. RLS enabled with zero policies denies anon and authenticated
-- outright; the service_role key used by server-side route handlers bypasses RLS.
