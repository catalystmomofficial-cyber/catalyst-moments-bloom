// Shared authorization helpers for edge functions.
//
// Several functions run with the SERVICE_ROLE key, which bypasses all RLS.
// Any function that does must decide authorization itself — never trust a
// value from the request body to gate access. These helpers centralize that.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ANON = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

/** True when the caller presents the service-role key (internal/cron calls). */
export function isServiceRoleRequest(req: Request): boolean {
  const bearer = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  return bearer.length > 0 && bearer === SERVICE_ROLE;
}

/** Resolve the authenticated user from the request's JWT, or null. */
export async function getUser(req: Request): Promise<{ id: string; email?: string } | null> {
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: ANON, Authorization: authHeader },
  });
  if (!res.ok) return null;
  const u = await res.json();
  return u?.id ? { id: u.id, email: u.email } : null;
}

/** True when the given user id has the admin role. */
export async function isAdmin(userId: string): Promise<boolean> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/admin_roles?user_id=eq.${userId}&role=eq.admin&select=role`,
    { headers: { apikey: ANON, Authorization: `Bearer ${SERVICE_ROLE}` } },
  );
  if (!res.ok) return false;
  const rows = await res.json();
  return Array.isArray(rows) && rows.length > 0;
}

/** True when the caller is the service role OR an authenticated admin. */
export async function isServiceOrAdmin(req: Request): Promise<boolean> {
  if (isServiceRoleRequest(req)) return true;
  const user = await getUser(req);
  if (!user) return false;
  return isAdmin(user.id);
}

/**
 * Optional shared-secret check for external webhooks. Returns true only when
 * the env secret is configured AND the request presents a matching header.
 * When the env secret is not set, returns null so callers can decide whether
 * to fail closed or allow (used during integration setup).
 */
export function checkSharedSecret(
  req: Request,
  envName: string,
  headerName = "x-webhook-secret",
): boolean | null {
  const expected = Deno.env.get(envName);
  if (!expected) return null;
  const provided = req.headers.get(headerName) ?? "";
  return provided.length > 0 && provided === expected;
}

/** Standard 401/403 JSON response with CORS headers. */
export function forbidden(corsHeaders: Record<string, string>, status = 403, message = "Forbidden") {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
