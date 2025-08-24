import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SessionUser = { id: string; email?: string; role?: string; orgId?: string };

// Define proper types for user metadata
interface UserMetadata {
  role?: string;
  orgId?: string;
  [key: string]: unknown;
}

// Define proper error type with status
interface AuthError extends Error {
  status: number;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const meta = (user.user_metadata ?? user.app_metadata ?? {}) as UserMetadata;
  return { id: user.id, email: user.email ?? undefined, role: meta.role, orgId: meta.orgId };
}

export async function requireSessionUser(): Promise<SessionUser> {
  const u = await getSessionUser();
  if (!u) { 
    const e = new Error("Unauthorized") as AuthError; 
    e.status = 401; 
    throw e; 
  }
  return u;
}

export function assertRole(user: SessionUser | null, roles: string[]) {
  if (!user || !roles.includes(String(user.role || ""))) { 
    const e = new Error("Forbidden") as AuthError; 
    e.status = 403; 
    throw e; 
  }
}
