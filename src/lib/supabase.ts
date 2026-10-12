import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * Uses the service_role key, which bypasses row level security. It must therefore never be
 * reachable from the browser bundle: it reads secrets from non-`NEXT_PUBLIC_` env vars, and
 * anything that imports it is server-only. If a client component ever pulls this in, throw
 * loudly rather than shipping a key to users.
 */

let client: SupabaseClient | null = null;

function supabaseUrl(): string | undefined {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabase(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error(
      "getSupabase() was called in the browser. The service_role key must never be shipped to the client."
    );
  }

  if (client) return client;

  const url = supabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment."
    );
  }

  client = createClient(url, key, {
    auth: {
      // Sessions are handled by this app's own HMAC cookie auth (src/lib/customer-auth.ts),
      // so Supabase Auth is not in play and no session should ever be persisted here.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return client;
}

/**
 * Throws the underlying PostgREST error if a query failed.
 *
 * PostgREST returns 200 with `{ error: ... }` in some failure shapes, and `supabase-js`
 * resolves rather than rejects, so a silent error would otherwise look like an empty table
 * -- which for a read-modify-write caller means "no records" and a wipe.
 */
export function assertNoError(result: { error: { message: string } | null }, context: string): void {
  if (result.error) {
    throw new Error(`${context}: ${result.error.message}`);
  }
}
