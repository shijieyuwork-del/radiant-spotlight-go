/** Keep the generated client intact; only actual browser work loads its SDK. */
let pending: Promise<typeof import("@/integrations/supabase/client")["supabase"]> | undefined;

export function getBrowserClient() {
  pending ??= import("@/integrations/supabase/client").then((module) => module.supabase);
  return pending;
}