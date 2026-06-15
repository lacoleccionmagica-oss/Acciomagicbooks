import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// ¡Usar SOLO en código de servidor (API routes)!
// La service_role key se salta Row Level Security.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
