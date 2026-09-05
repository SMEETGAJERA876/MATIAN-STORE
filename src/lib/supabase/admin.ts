import { createAdminClient } from "@supabase/server/core";
import { resolveSupabaseEnv } from "./env";
import type { Database } from "./types";

export function getSupabaseAdmin() {
  return createAdminClient<Database>({ env: resolveSupabaseEnv() });
}
