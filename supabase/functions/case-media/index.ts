import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { handleCaseMedia } from "./rules.ts";

Deno.serve(async (req) => {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return new Response("Media temporarily unavailable", { status: 503, headers: { ...corsHeaders, "Cache-Control": "no-store" } });
  const client = createClient(url, key, { auth: { persistSession: false } });
  return handleCaseMedia(req, {
    lookup: async (id) => {
      const { data, error } = await client.from("videos").select("status,storage_path,cover_path").eq("id", id).eq("status", "published").maybeSingle();
      if (error) throw error;
      return data;
    },
    sign: async (bucket, path, seconds) => {
      const { data, error } = await client.storage.from(bucket).createSignedUrl(path, seconds);
      if (error) throw error;
      return data?.signedUrl ?? null;
    },
  }, corsHeaders);
});
